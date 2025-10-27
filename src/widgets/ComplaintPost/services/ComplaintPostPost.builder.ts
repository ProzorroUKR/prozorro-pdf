import { complaintPostPerson, POST_TITLES } from "@/widgets/ComplaintPost/config/COMPLAINT_POST";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { DATE_FORMAT } from "@/constants/date.ts";

interface IComplaintPostBuilder {
  getResult: Record<string, any>[];
  setSequenceNumber: IComplaintPostBuilder;
  setAuthor: IComplaintPostBuilder;
  setRecipient: IComplaintPostBuilder;
  setDatePublished: IComplaintPostBuilder;
  setTitle: IComplaintPostBuilder;
  setDescription: IComplaintPostBuilder;
}

export class ComplaintPostPostBuilder implements IComplaintPostBuilder {
  private readonly _complaint: Record<string, any>;
  private readonly _objections: string[] = [];
  private readonly _postData: Record<string, any> = {};

  constructor(complaint: Record<string, any>) {
    this._complaint = complaint;
    complaint.objections.forEach((objection: { id: any; sequenceNumber: any }): void => {
      this._objections[objection.sequenceNumber - 1] = objection.id;
    });
  }

  get setSequenceNumber(): IComplaintPostBuilder {
    this._objections.forEach((key: string, index: number) => {
      if (
        this._complaint.posts.reduce(
          (accum: boolean, post: Record<string, any>) => accum || key === post.relatedObjection,
          false
        )
      ) {
        this._postData[key] = {};
        this._postData[key]["header"] = {
          text: `${POST_TITLES.sequenceNumber}  ${index + 1}`,
          style: PDF_FILED_KEYS.COMPLAINT_POST,
        };
      }
    });
    return this;
  }

  get setAuthor(): IComplaintPostBuilder {
    this._complaint.posts.forEach((post: Record<string, any>) => {
      this._postData[post.relatedObjection][post.id] = [];
      this._postData[post.relatedObjection][post.id].push({
        head: POST_TITLES.author,
        data: complaintPostPerson.get(post.author),
      });
    });
    return this;
  }

  get setRecipient(): IComplaintPostBuilder {
    this._complaint.posts.forEach((post: Record<string, any>) => {
      if (!post.recipient) {
        return;
      }

      this._postData[post.relatedObjection][post.id].push({
        head: POST_TITLES.receiver,
        data: complaintPostPerson.get(post.recipient),
      });
    });
    return this;
  }

  get setDatePublished(): IComplaintPostBuilder {
    this._complaint.posts.forEach((post: Record<string, any>) => {
      const dateCurrent = new Date(post.datePublished);
      const dateString = dateCurrent.toLocaleString("uk-UA", DATE_FORMAT).replace(",", "");

      this._postData[post.relatedObjection][post.id].push({
        head: POST_TITLES.date,
        data: dateString,
      });
    });
    return this;
  }

  get setTitle(): IComplaintPostBuilder {
    this._complaint.posts.forEach((post: Record<string, any>) => {
      this._postData[post.relatedObjection][post.id].push({
        head: POST_TITLES.heading,
        data: post.title,
      });
    });
    return this;
  }

  get setDescription(): IComplaintPostBuilder {
    this._complaint.posts.forEach((post: Record<string, any>) => {
      this._postData[post.relatedObjection][post.id].push({
        head: POST_TITLES.content,
        data: post.description,
      });
    });
    return this;
  }

  setDocuments(
    postKey: string
  ): { head: string; data: Record<string, any>; hasMargin?: boolean; marginTop?: boolean } | undefined {
    const documentsIds = new Map<string, string>();
    this._complaint.documents.forEach((document: Record<string, any>) => {
      if (!Object.keys(documentsIds).includes(document.id)) {
        documentsIds.set(document.id, document.datePublished);
      } else if ((documentsIds.get(document.id) || "") > document.datePublished) {
        documentsIds.delete(document.id);
        documentsIds.set(document.id, document.datePublished);
      }
    });

    const documents = this._complaint.documents
      .filter(
        (document: Record<string, any>) =>
          document.documentOf === "post" && document.relatedItem === postKey && document.title !== "sign.p7s"
      )
      .filter((document: Record<string, any>) => documentsIds.get(document.id) === document.datePublished)
      .map((document: Record<string, any>) => ({
        text: document.title,
        link: document.url,
        style: { color: "#185acd", decoration: "underline" },
      }));

    return documents.length
      ? {
          head: POST_TITLES.documents,
          data: { ul: documents },
          hasMargin: false,
        }
      : undefined;
  }

  get getResult(): Record<string, any>[] {
    const posts: Record<string, any>[] = [];

    this._objections.forEach(objectionKey => {
      if (!this._postData[objectionKey]) {
        return;
      }
      posts.push(this._postData[objectionKey].header);

      Object.keys(this._postData[objectionKey])
        .reverse()
        .forEach(postKey => {
          if (postKey !== "header") {
            const body = this._postData[objectionKey][postKey].map((item: Record<string, any>) =>
              PDFTablesHandler.createTableRow({
                head: item.head,
                data: item.data,
                hasMargin: false,
              })
            );
            if (this.setDocuments(postKey)) {
              body.push(PDFTablesHandler.createTableRowNoText(this.setDocuments(postKey) as any));
            }

            posts.push(
              PDFTablesHandler.resolveTableBug(
                PDFTablesHandler.createTable(
                  body,
                  [PDF_HELPER_CONST.ROW_WIDTH_75, PDF_HELPER_CONST.ROW_WIDTH_423],
                  "",
                  PDF_HELPER_CONST.LINE_HEIGHT_15,
                  1,
                  false
                ),
                {}
              )
            );
          }
        });
    });

    return posts;
  }
}
