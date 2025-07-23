declare module "services/Widget/WidgetUserServiceInterface" {
  export interface WidgetUserServiceInterface {
    resetKey(): Promise<void>;
  }
}
declare module "types/objectTypes/ObjectOf" {
  export type ObjectOf<T> = {
    [key: string]: T;
  };
}
declare module "types/sign/TimeType" {
  export type TimeType = {
    year: number;
    month: number;
    dayOfWeek: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    milliseconds: number;
  };
}
declare module "types/sign/SignerType" {
  import { TimeType } from "types/sign/TimeType";
  export type SignerType = {
    isFilled: boolean;
    isTimeAvail: boolean;
    isTimeStamp: boolean;
    issuer: string;
    issuerCN: string;
    serial: string;
    subject: string;
    subjectCN: string;
    subjectOrg: string;
    subjectOrgUnit: string;
    subjectTitle: string;
    subjectState: string;
    subjectLocality: string;
    subjectFullName: string;
    subjectAddress: string;
    subjectPhone: string;
    subjectEMail: string;
    subjectDNS: string;
    subjectEDRPOUCode: string;
    subjectDRFOCode: string;
    time: TimeType;
  };
}
declare module "types/sign/SignType" {
  import { SignerType } from "types/sign/SignerType";
  export type SignType = {
    data: string;
    signers: SignerType[];
  };
}
declare module "types/signedObjectType" {
  export type SignedObjectType = {
    id: string;
    sign: Uint8Array | string;
  };
}
declare module "types/IIT/Widget/InfoExInterface" {
  export namespace Certificate {
    interface InfoExType {
      OCSPAccessInfo: string;
      RSAExponent: string;
      RSAModul: string;
      TSPAccessInfo: string;
      UPN: string;
      certBeginTime: Date;
      certEndTime: Date;
      chainLength: number;
      crlDistribPoint1: string;
      crlDistribPoint2: string;
      extKeyUsages: string;
      fingerprint: string;
      isFilled: boolean;
      isLimitValueAvailable: boolean;
      isPowerCert: boolean;
      isPrivKeyTimesAvail: boolean;
      isQSCD: boolean;
      isSubjCA: boolean;
      isSubjTypeAvail: boolean;
      issuer: string;
      issuerAccessInfo: string;
      issuerCN: string;
      issuerPublicKeyID: string;
      keyUsage: string;
      keyUsageType: number;
      limitValue: number;
      limitValueCurrency: string;
      policies: string;
      privKeyBeginTime: Date;
      privKeyEndTime: Date;
      publicKey: string;
      publicKeyBits: number;
      publicKeyID: string;
      publicKeyType: number;
      serial: string;
      subjAddress: string;
      subjCN: string;
      subjCountry: string;
      subjDNS: string;
      subjDRFOCode: string;
      subjEDRPOUCode: string;
      subjEMail: string;
      subjFullName: string;
      subjLocality: string;
      subjNBUCode: string;
      subjOCode: string;
      subjOUCode: string;
      subjOrg: string;
      subjOrgUnit: string;
      subjPhone: string;
      subjSPFMCode: string;
      subjState: string;
      subjSubType: number;
      subjTitle: string;
      subjType: number;
      subjUNZR: string;
      subjUserCode: string;
      subjUserID: string;
      subject: string;
      version: number;
    }
  }
}
declare module "types/IIT/Widget/CertificateType" {
  import { Certificate } from "types/IIT/Widget/InfoExInterface";
  export type CertificateType = {
    data: Uint8Array;
    infoEx: Certificate.InfoExType;
  };
}
declare module "types/UserOptionsType" {
  import { CertificateType } from "types/IIT/Widget/CertificateType";
  export type UserOptionsType = {
    ignoreFields?: string[];
    callbackAfterAuth?: (certificates: CertificateType[]) => void;
    debug?: boolean;
  };
}
declare module "types/UserSignOptionsType" {
  export type UserSignOptionsType = {
    asBase64String?: boolean;
    previousSign?: Uint8Array | string | null;
    external?: boolean;
  };
}
declare module "types/DiffPatcher/DeltaType" {
  export type DeltaType = {
    [key: string]: any;
    [key: number]: any;
  };
}
declare module "types/VerifyObjectResponseType" {
  import { SignerType } from "types/sign/SignerType";
  import { DeltaType } from "types/DiffPatcher/DeltaType";
  import { ObjectOf } from "types/objectTypes/ObjectOf";
  export type VerifyObjectResponseType = {
    difference?: DeltaType;
    signers: SignerType[];
    data: {
      fromSign: ObjectOf<any>;
      fromDb: ObjectOf<any>;
    };
  };
}
declare module "constants/encoding" {
  export enum ENCODING {
    WINDOWS_1251 = "windows-1251",
    UTF_16LE = "UTF-16LE",
    UTF_16 = "UTF-16",
    UTF_8 = "UTF-8",
  }
}
declare module "services/EdsInterface" {
  import { WidgetUserServiceInterface } from "services/Widget/WidgetUserServiceInterface";

  import { ObjectOf } from "types/objectTypes/ObjectOf";
  import { SignType } from "types/sign/SignType";
  import { SignedObjectType } from "types/signedObjectType";
  import { UserOptionsType } from "types/UserOptionsType";
  import { UserSignOptionsType } from "types/UserSignOptionsType";
  import { VerifyObjectResponseType } from "types/VerifyObjectResponseType";
  import { ENCODING } from "constants/encoding";
  export interface EdsInterface {
    init(options?: UserOptionsType): Promise<void>;
    loadWidget(): Promise<WidgetUserServiceInterface>;
    sign(data: Uint8Array | string, options?: UserSignOptionsType): Promise<Uint8Array | string>;
    signHash(data: string, options?: UserSignOptionsType): Promise<Uint8Array | string>;
    signObjects(links: string[], options?: UserSignOptionsType): Promise<SignedObjectType[]>;
    verify(sign: string, encoding?: ENCODING): Promise<SignType>;
    verifyObjects(links: string[]): Promise<VerifyObjectResponseType[] | Error>;
    formatObject(data: ObjectOf<any>): ObjectOf<any>;
  }
}
