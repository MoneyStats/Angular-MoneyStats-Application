export class GenericModel {
  id?: number;
  creationDate?: Date;
  updateDate?: Date;
  deletedDate?: Date;
}

export class ResponseModel {
  status?: number;
  message?: string;
  correlationId?: string;
  data: any;
}
