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

export enum errorCode {
  GenericException = 'ERR_AUTH_MSS_003',
  Authentication = 'ERR_AUTH_MSS_004',
}
