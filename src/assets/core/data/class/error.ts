export class UtilsException {
  dateTime?: Date;
  url?: string;
  correlationId?: string;
  error?: Error;
}

export class Error {
  statusCode?: number;
  exceptionCode?: string;
  exceptionName?: string;
  status?: string;
  message?: string;
  exceptionMessage?: string;
  stackTrace?: string;
}

export enum ExceptionCode {
  Authentication = 'ERR_AUTH_MSS_004',
}
