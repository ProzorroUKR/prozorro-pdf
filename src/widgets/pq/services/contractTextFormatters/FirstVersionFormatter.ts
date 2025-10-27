import type {
  CompoundStringListItem,
  PQContractType,
  PQItem,
  PQspecificationListItem,
  PQsupplier,
  PQvalue,
  TextListItem,
} from "@/widgets/pq/types/PQTypes";
import { pqBase, pqSignature, pqSpecificationTexts } from "@/widgets/pq/configs/pqTexts";
import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { STRING } from "@/constants/string";
import * as PDF_HELPER_CONST from "@/constants/pdf/pdfHelperConstants";
import { PDF_FILED_KEYS } from "@/constants/pdf/pdfFieldKeys";
import { PROZORRO_TEMPLATE_CODES } from "@/widgets/pq/types/TemplateCodes.enum";
import type { AddressType } from "@/types/Tender/AddressType";
import { StringHandler } from "@/utils/StringHandler";
import { AllVersionFormatter } from "@/widgets/pq/services/contractTextFormatters/AllVersionFormatter";
import { DateHandler } from "@/utils/DateHandler";
import { TemplateToTableHead } from "@/widgets/pq/configs/TableHead.map";
import { generalTableHeader } from "@/widgets/pq/templates/computers/configs/computersContract.config";
import type { PDFTableBodyType } from "@/widgets/pq/types/TextConfigType";
import { ItemAttributesFormatter } from "@/widgets/pq/services/Items/ItemAttributesFormatter";
import { PriceHandler } from "@/services/Common/PriceHandler";
import { PDF_STYLES } from "@/config/pdf/pdfStyles";
import { PQ_LIST_HEADING_MARGIN, PQ_SPECIFICATION_HEADING_MARGIN } from "@/widgets/pq/configs/margins";
import { PDFTablesHandler } from "@/services/PDF/Formatting/PDFTablesHandler";
import * as TABLES_HELPER from "@/widgets/pq/configs/tablesConfig";
import { TemplateToSpecificationListMap } from "@/widgets/pq/configs/TemplateToSpecificationList.map";
import { generalListConfig } from "@/widgets/pq/templates/other/configs/generalListConfig";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";
import { ClassificationTransformer } from "@/widgets/pq/services/Classification/ClassificationTransformer";
import type { ClassificationType } from "@/types/Tender/ClassificationType";

export class FirstVersionFormatter {
  static isMedicineTemplate(templateName: PROZORRO_TEMPLATE_CODES): boolean {
    return [PROZORRO_TEMPLATE_CODES.MEDICINE, PROZORRO_TEMPLATE_CODES.PHARM].includes(templateName);
  }

  static createBasicHeader(
    contractObject: PQContractType,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES
  ): Record<string, any>[] {
    const nextNamedBuyer = FirstVersionFormatter.isMedicineTemplate(contractTemplateParam)
      ? pqBase.nextNamedCustomer
      : pqBase.nextNamedBuyer;

    const firstPar = [
      DocumentExtractionService.getField(
        contractObject,
        "buyer.identifier.legalName",
        DocumentExtractionService.getField(contractObject, "buyer.name", pqBase.customerName)
      ),
      STRING.DELIMITER.COMMA,
      DocumentExtractionService.getField(contractObject, "buyer.identifier.id", pqBase.edrpou),
      nextNamedBuyer,
      DocumentExtractionService.getField(contractObject, "buyer.signerInfo.name", pqBase.accreditedPerson),
      pqBase.basisOf,
      DocumentExtractionService.getField(contractObject, "buyer.signerInfo.authorizedBy", pqBase.accreditedDocument),
      pqBase.onOneSide,
      STRING.DELIMITER.NEW_LINE.concat(STRING.DELIMITER.NEW_LINE),
    ];

    const nextBuyer = FirstVersionFormatter.isMedicineTemplate(contractTemplateParam) ? STRING.EMPTY : pqBase.nextBuyer;

    const secondPar = [
      DocumentExtractionService.getField(
        contractObject,
        "suppliers[0].identifier.legalName",
        DocumentExtractionService.getField(contractObject, "suppliers[0].name", pqBase.supplierName)
      ),
      STRING.DELIMITER.COMMA,
      DocumentExtractionService.getField(contractObject, "suppliers[0].identifier.id"),
      pqBase.nextSupplier,
      DocumentExtractionService.getField(contractObject, "suppliers[0].signerInfo.name"),
      pqBase.basisOf,
      DocumentExtractionService.getField(contractObject, "suppliers[0].signerInfo.authorizedBy"),
      pqBase.onOneSide,
      DocumentExtractionService.getField(contractObject, "buyer.identifier.legalName"),
      nextBuyer,
      DocumentExtractionService.getField(contractObject, "buyer.signerInfo.name"),
      pqBase.nextSides,
      DocumentExtractionService.getField(contractObject, "contractID", pqBase.tenderId).slice(
        0,
        DocumentExtractionService.getField<string>(contractObject, "contractID").length -
          PDF_HELPER_CONST.CONTRACT_ID_TRIM_TO
      ),
      pqBase.nextContract,
    ];

    return [
      {
        text: firstPar,
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
      {
        text: secondPar,
        style: PDF_FILED_KEYS.TABLE_DATA,
      },
    ];
  }

  static createSignature(
    contractObject: PQContractType | Record<any, any>,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES
  ): Record<string, any> {
    const { buyer } = contractObject;
    const supplier = DocumentExtractionService.getField<PQsupplier | string>(contractObject, "suppliers[0]");
    const fromBuyer = FirstVersionFormatter.isMedicineTemplate(contractTemplateParam)
      ? pqSignature.customer
      : pqSignature.buyer;

    return {
      table: {
        widths: [PDF_HELPER_CONST.ROW_WIDTH_250, "auto"],
        body: [
          [pqSignature.supplier, fromBuyer],
          [
            DocumentExtractionService.getField(
              supplier as any,
              "name",
              pqSignature.name + STRING.WHITESPACE + pqSignature.suppliers
            ),
            DocumentExtractionService.getField(
              buyer,
              "name",
              pqSignature.name + STRING.WHITESPACE + pqSignature.buyers
            ),
          ],
          [
            StringHandler.customerLocation(
              DocumentExtractionService.getField<AddressType>(supplier as any, "address")
            ) || pqSignature.location,
            StringHandler.customerLocation(DocumentExtractionService.getField<AddressType>(buyer, "address")) ||
              pqSignature.location,
          ],
          [
            DocumentExtractionService.getField(
              supplier as any,
              "identifier.id",
              pqSignature.edrpou + STRING.WHITESPACE + pqSignature.suppliers
            ),
            DocumentExtractionService.getField(
              buyer,
              "identifier.id",
              pqSignature.edrpou + STRING.WHITESPACE + pqSignature.buyers
            ),
          ],
          [
            DocumentExtractionService.getField(
              supplier as any,
              "signerInfo.iban",
              pqSignature.iban + STRING.WHITESPACE + pqSignature.suppliers
            ),
            DocumentExtractionService.getField(
              buyer,
              "signerInfo.iban",
              pqSignature.iban + STRING.WHITESPACE + pqSignature.buyers
            ),
          ],
          [
            DocumentExtractionService.getField(
              supplier as any,
              "signerInfo.telephone",
              pqSignature.phone + STRING.WHITESPACE + pqSignature.suppliers
            ),
            DocumentExtractionService.getField(
              buyer,
              "signerInfo.telephone",
              pqSignature.phone + STRING.WHITESPACE + pqSignature.buyers
            ),
          ],
          [
            DocumentExtractionService.getField(
              supplier as any,
              "signerInfo.email",
              `${pqSignature.email} ${pqSignature.suppliers}`
            ),
            DocumentExtractionService.getField(buyer, "signerInfo.email", `${pqSignature.email} ${pqSignature.buyers}`),
          ],
          [
            DocumentExtractionService.getField(supplier as any, "signerInfo.website", pqSignature.website),
            DocumentExtractionService.getField(buyer, "signerInfo.website", pqSignature.website),
          ],
          [STRING.EMPTY, STRING.EMPTY],
          [pqSignature.signature, pqSignature.signature],
          [pqSignature.stamp, pqSignature.stamp],
        ],
      },
      layout: "noBorders",
    };
  }

  static createAddition(
    contractObject: PQContractType | Record<any, any>,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES
  ): Record<string, any>[] {
    const { items = [] } = contractObject;

    const header = AllVersionFormatter.additionHeader(
      contractObject,
      contractTemplateParam,
      pqSpecificationTexts.addition1,
      pqSpecificationTexts.toContract,
      pqSpecificationTexts.specification,
      DateHandler.prepareDateSigned(DocumentExtractionService.getField(contractObject, "dateSigned"), "р.")
    );

    const tableHeader = TemplateToTableHead.get(contractTemplateParam) || generalTableHeader;

    const body: PDFTableBodyType = [];
    body.push(tableHeader);

    if ((items as [])?.length) {
      (items as PQItem[]).forEach(item => {
        const itemPrice = DocumentExtractionService.getField<PQvalue>(item, "unit.value");
        const currency = DocumentExtractionService.getField<string>(itemPrice, "currency");

        return body.push([
          DocumentExtractionService.getField(item, "description"),
          ItemAttributesFormatter.formatAttribute(item.attributes),
          DocumentExtractionService.getField(item, "quantity"),
          DocumentExtractionService.getField(item, "unit.name"),
          PriceHandler.addCurrency(PriceHandler.getPrice(itemPrice), currency),
          PriceHandler.addCurrency(
            PriceHandler.getPrice(itemPrice, Number(DocumentExtractionService.getField(item, "quantity"))),
            currency
          ),
        ]);
      });
    } else {
      body.push([{}, {}, {}, {}, {}, {}]);
    }

    body.push([
      {
        text: pqSpecificationTexts.totalPrice,
        colSpan: 5,
      },
      {},
      {},
      {},
      {},
      DocumentExtractionService.getField(contractObject, "value.amountNet", STRING.EMPTY),
    ]);

    body.push([
      {
        text: pqSpecificationTexts.tax,
        colSpan: 5,
      },
      {},
      {},
      {},
      {},
      (
        Number(DocumentExtractionService.getField(contractObject, "value.amount")) -
        Number(DocumentExtractionService.getField(contractObject, "value.amountNet"))
      ).toString(),
    ]);

    body.push([
      {
        text: pqSpecificationTexts.priceWithTax,
        colSpan: 5,
      },
      {},
      {},
      {},
      {},
      DocumentExtractionService.getField(contractObject, "value.amount"),
    ]);

    const underTableList = {
      ol: this.createSpecificationUnderTableList(contractObject, contractTemplateParam),
      style: PDF_STYLES.bold,
      margin: PQ_LIST_HEADING_MARGIN,
    };

    let specificNote = PDF_HELPER_CONST.EMPTY_FIELD;
    if (FirstVersionFormatter.isMedicineTemplate(contractTemplateParam)) {
      specificNote = {
        text: pqSpecificationTexts.note,
        margin: PQ_SPECIFICATION_HEADING_MARGIN,
      };
    }

    return [
      header,
      PDFTablesHandler.createTable(body, TABLES_HELPER.PQ_TABLE_ITEMS_WIDTH),
      underTableList,
      specificNote,
    ];
  }

  static createSpecificationUnderTableList(
    contractObject: PQContractType | Record<string, any>,
    contractTemplateParam: PROZORRO_TEMPLATE_CODES
  ): string[] {
    const tableList: string[] = [];
    const listConfig = TemplateToSpecificationListMap.get(contractTemplateParam) || generalListConfig;

    listConfig.forEach(listItem => {
      tableList.push(
        listItem.reduce((previousValue: string, currentValue: PQspecificationListItem): string => {
          if (
            currentValue.hasOwnProperty("functionName") &&
            DocumentExtractionService.getField(currentValue, "functionName") &&
            DocumentExtractionService.getField(contractObject, (currentValue as CompoundStringListItem).path)
          ) {
            const preparedValue = DocumentExtractionService.getField(
              contractObject,
              (currentValue as CompoundStringListItem).path
            );
            switch (DocumentExtractionService.getField(currentValue, "functionName")) {
              case FormattingFunctionsEnum.FORMAT_CLASSIFICATION:
                return previousValue.concat(
                  ClassificationTransformer.formatClassification(preparedValue as ClassificationType) ||
                    (currentValue as CompoundStringListItem).default
                );
              case FormattingFunctionsEnum.CUSTOMER_LOCATION:
                return previousValue.concat(StringHandler.customerLocation(preparedValue as AddressType));
              case FormattingFunctionsEnum.DELIVERY_DATE_DIFF:
                if (!(preparedValue as string) || !contractObject.dateSigned) {
                  return previousValue.concat((currentValue as CompoundStringListItem).default);
                }

                return previousValue.concat(
                  DateHandler.deliveryDateDiff(
                    {
                      startDate: contractObject.dateSigned as string,
                      endDate: preparedValue as string,
                    },
                    (currentValue as CompoundStringListItem).default
                  )
                );
              case FormattingFunctionsEnum.FORMAT_DATE:
                return previousValue.concat(DateHandler.phpDateFormat(preparedValue as string));
            }
          }

          if (currentValue.hasOwnProperty("path") && DocumentExtractionService.getField(currentValue, "path")) {
            return previousValue.concat(
              DocumentExtractionService.getField(
                contractObject,
                (currentValue as CompoundStringListItem).path,
                (currentValue as CompoundStringListItem).default
              )
            );
          }

          if (currentValue.hasOwnProperty("text")) {
            return previousValue.concat((currentValue as TextListItem).text);
          }

          return previousValue;
        }, STRING.EMPTY)
      );
    });

    return tableList;
  }
}
