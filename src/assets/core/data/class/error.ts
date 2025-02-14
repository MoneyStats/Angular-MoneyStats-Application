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
  Authentication = 'ERR_AUTH_MSS_401',
}

export enum ErrorCode {
  UnknowError = 'ERR_UNK_MSS_001',
  Invitation_Code = 'ERR_AUTH_MSS_005',
  Authentication = 'ERR_AUTH_MSS_401',
  Forbidden = 'ERR_AUTH_MSS_403',
}

export enum ErrorMessageMetadata {
  KEY = '$KEY$',
}
