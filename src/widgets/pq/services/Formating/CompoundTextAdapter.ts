import { DocumentExtractionService } from "@/services/PDF/document/DocumentExtractionService";
import { DateHandler } from "@/utils/DateHandler";
import type { RequirementResponseType, TenderOfferType } from "@/types/TenderOffer/Tender";
import { DEFAULT_TEXT_FIELDS, STRING } from "@/constants/string";
import { NumbersSpeller } from "@/utils/numbersSpeller/NumbersSpeller";
import { GET_PERCENT } from "@/constants/pdf/pdfHelperConstants";
import { UnitHelper } from "@/services/Common/UnitHelper";
import { PriceHandler } from "@/services/Common/PriceHandler";
import { CURRENCY_VOCABULARY } from "@/utils/numbersSpeller/config/CURRENCY_VOCABULARY";
import { FormattingFunctionsEnum } from "@/widgets/pq/services/Formating/config/FormattingFunctions.enum";
import { pqGenericBase } from "@/widgets/pq/templates/generic/configs/pqGenericTexts";
import { PQpaymentDetails } from "@/widgets/pq/services/PQpaymentDetails/PQpaymentDetails";
import { EnsuringRequirementsParser } from "@/widgets/pq/services/ContractEnsuring/EnsuringRequirementsParser";
import {
  ENSURING_PERCENT_REQUIREMENTS,
  ENSURING_PERIOD_REQUIREMENTS,
} from "@/widgets/pq/services/ContractEnsuring/config/PQreqirements";
import { EnsuringOptionToTextMap } from "@/widgets/pq/services/ContractEnsuring/config/EnsuringOptionToTextMap";
import { pqBase } from "@/widgets/pq/configs/pqTexts";

export class CompoundTextAdapter {
  private static readonly _numberSpeller = new NumbersSpeller();

  static convertToText(
    path: string,
    functionName: string,
    dataObject: Record<any, any>,
    defaults: string,
    tender?: Record<string, any>
  ): string {
    switch (functionName) {
      case FormattingFunctionsEnum.NUMBER_TO_TEXT as string:
        return CompoundTextAdapter._numberSpeller.convertToWords(
          DocumentExtractionService.getField(dataObject, path, defaults),
          defaults
        );

      case FormattingFunctionsEnum.TENDER_ID as string:
        return DocumentExtractionService.getField(tender || {}, path, defaults);

      case FormattingFunctionsEnum.PRICE_WITH_TAX_TO_TEXT as string: {
        const price = DocumentExtractionService.getField(dataObject, path, STRING.EMPTY);
        const isTaxIncluded = DocumentExtractionService.getField<boolean>(
          dataObject,
          "value.valueAddedTaxIncluded",
          false
        );

        if (!price) {
          return defaults;
        }

        const result: string[] = [];
        result.push(`${PriceHandler.formatPriceWithSpelling(price, CURRENCY_VOCABULARY.UAH)}`);

        if (isTaxIncluded) {
          const priceNet = DocumentExtractionService.getField<number>(dataObject, "value.amountNet");
          result.push(
            priceNet
              ? `${pqGenericBase.includingTax}${PriceHandler.formatPriceWithSpelling(Number(price) - Number(priceNet), CURRENCY_VOCABULARY.UAH)}`
              : STRING.EMPTY
          );
        }

        result.push(STRING.DOT);

        return result.join(STRING.EMPTY);
      }

      case FormattingFunctionsEnum.CONVERT_DATE as string:
        return DateHandler.prepareDateSigned(DocumentExtractionService.getField(dataObject, path));

      /*
       *   Payment details list from tender milestones, iterated with 1), 2), 3) etc.
       */
      case FormattingFunctionsEnum.PAYMENT_DETAILS as string: {
        const paymentDetailsHandler = new PQpaymentDetails(
          tender as TenderOfferType,
          DocumentExtractionService.getField(dataObject, "items", [])
        );

        return paymentDetailsHandler.createPaymentDetailsBlock();
      }

      case FormattingFunctionsEnum.GET_GUARANTEE_PERIOD as string: {
        const period = EnsuringRequirementsParser.findRequirementValue(
          dataObject as RequirementResponseType[],
          ENSURING_PERIOD_REQUIREMENTS,
          defaults
        );

        return `${period} (${CompoundTextAdapter._numberSpeller.convertToWords(period, DEFAULT_TEXT_FIELDS.UNDERSCORES_16)})`;
      }

      case FormattingFunctionsEnum.GET_ENSURING_TYPE as string: {
        const option = EnsuringRequirementsParser.findEnsuringOption(dataObject as RequirementResponseType[]);

        return EnsuringOptionToTextMap.get(option) || defaults;
      }

      case FormattingFunctionsEnum.GET_PERCENT as string: {
        return EnsuringRequirementsParser.findRequirementValue(
          dataObject as RequirementResponseType[],
          ENSURING_PERCENT_REQUIREMENTS,
          defaults
        );
      }

      case FormattingFunctionsEnum.GET_ENSURING_OPTIONAL_FIELD as string: {
        return EnsuringRequirementsParser.getEnsuringOptionalField(dataObject as RequirementResponseType[]);
      }

      case FormattingFunctionsEnum.EDUCATION_PRICE as string: {
        const contractAmount = Number(DocumentExtractionService.getField(dataObject, path, defaults));
        const educationAmount = String(contractAmount * GET_PERCENT.TEN || STRING.EMPTY);

        return educationAmount
          ? `${UnitHelper.currencyFormatting(educationAmount)} ${pqBase.hryvnias} (${this._numberSpeller.priceToWords(educationAmount, defaults)})`
          : defaults;
      }

      default:
        return defaults;
    }
  }
}
