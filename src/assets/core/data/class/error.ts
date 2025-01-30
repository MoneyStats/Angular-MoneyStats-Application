export class UtilsException {
  dateTime?: Date;
  url?: string;
  correlationId?: string;
  error?: Error;
}

export class Error {
  statusCode?: number;
  errorCode?: string;
  exception?: string;
  status?: string;
  message?: string;
  exceptionMessage?: string;
  stackTrace?: string;
}

export enum ErrorCodeLogout {
  UnknowError = 'ERR_UNK_MSS_001',
  InternalServerError = 'INT_ERR_MSS_001',
  Authentication = 'ERR_AUTH_MSS_008',
}

export enum ErrorCode {
  UnknowError = 'ERR_UNK_MSS_001',
  Duplicate_Key = 'ERR_AUTH_MSS_003',
  Authentication = 'ERR_AUTH_MSS_004',
  Invitation_Code = 'ERR_AUTH_MSS_005',
}

export enum ErrorMessageMetadata {
  KEY = '$KEY$',
}
