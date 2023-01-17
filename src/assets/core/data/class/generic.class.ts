export class GenericModel {
  id?: number;
  deleted?: string;
}

export class ResponseModel {
  status?: number;
  message?: string;
  correlationId?: string;
  data: any;
}
