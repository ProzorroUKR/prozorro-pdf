import type { PQItem } from "@/widgets/pq/types/PQTypes";
import type { PQpaymentDetailsInterface } from "@/widgets/pq/services/PQpaymentDetails/PQpaymentDetailsInterface";
import { pqGenericPaymentDetails } from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import type { Milestone } from "@/types/Announcement/AnnouncementTypes";
import { STRING } from "@/constants/string";
import {
  MILESTONE_EVENT_TITLE,
  MILESTONES_PAYMENT_TYPE,
  PQ_RELATED_MILESTONES_TYPE,
} from "@/widgets/pq/services/PQpaymentDetails/constants/milestones";
import { NumbersSpeller } from "@/utils/numbersSpeller/NumbersSpeller";

export class PQpaymentDetails implements PQpaymentDetailsInterface {
  private readonly result: string[] = [];

  constructor(
    private readonly milestones: Milestone[],
    private readonly items: PQItem[]
  ) {}

  createPaymentDetailsBlock(): string {
    const relatedLots = this.getContractRelatedLots();
    const milestones: Milestone[] = this.getRelatedMilestones(relatedLots);

    if (!milestones.length) {
      // якщо немає відповідних майлстоунів
      return STRING.EMPTY;
    }

    milestones.forEach((milestone, index): void => {
      this.addLinePrefix(index);
      this.createPaymentDetailsLine(milestone);
    });

    return this.result.join(STRING.EMPTY);
  }

  /*
   * Отримати з тендера майлстоуни, які відносяться до контракту
   */
  private getRelatedMilestones(relatedLots: string[]): Milestone[] {
    const relatedMilestones =
      this.milestones.filter(milestone => relatedLots.includes(milestone?.relatedLot || STRING.EMPTY)) || [];

    return relatedMilestones.length
      ? this.filterMilestonesByType(relatedMilestones)
      : this.filterMilestonesByType(this.milestones) || [];
  }

  /*
   * Отримати з тендера майлстоуни, що мають type = delivery || financing
   */
  private filterMilestonesByType(milestones: Milestone[] | undefined): Milestone[] {
    return milestones?.filter(milestone => PQ_RELATED_MILESTONES_TYPE.includes(milestone?.type || STRING.EMPTY)) || [];
  }

  /*
   * Отримати лоти по яким створено контракт
   */
  private getContractRelatedLots(): string[] {
    return this.items.reduce((relatedLots: string[], item) => {
      if (item.relatedLot) {
        relatedLots.push(item.relatedLot);
      }

      return relatedLots;
    }, []);
  }

  private addLinePrefix(index: number): void {
    this.result.push(`${index + 1})   `);
  }

  private createPaymentDetailsLine(milestone: Milestone): void {
    this.result.push(
      MILESTONES_PAYMENT_TYPE[milestone.code],
      pqGenericPaymentDetails.size,
      String(milestone.percentage),
      STRING.PERCENT,
      pqGenericPaymentDetails.period,
      NumbersSpeller.getBankDaysForm(milestone.duration),
      pqGenericPaymentDetails.days,
      MILESTONE_EVENT_TITLE[milestone.title],
      milestone.description ? `${pqGenericPaymentDetails.other} ${milestone.description}.` : STRING.DELIMITER.DOT,
      STRING.DELIMITER.NEW_LINE
    );
  }
}
