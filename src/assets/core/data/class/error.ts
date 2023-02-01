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
}
