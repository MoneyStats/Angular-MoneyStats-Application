import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilsException } from '../data/class/error';
import { Error } from '../data/class/error';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public exception: UtilsException = new UtilsException();
  environment = environment;
  constructor(private http: HttpClient) {}

  getError(error: any) {
    if (error.error.error) {
      this.exception = error.error;
      this.exception.error!.statusCode = error.status;
    } else {
      this.getUnknowError(error);
    }
  }

  getUnknowError(error: any) {
    this.exception.url = error.url;
    this.exception.dateTime = new Date();
    let errorModel: Error = new Error();
    errorModel.exceptionCode = 'ERR_AUTH_MSS_004';
    errorModel.message = error.message;
    errorModel.statusCode = HttpStatusCode.InternalServerError;
    errorModel.exceptionName = error.statusText;
    this.exception.error = errorModel;
  }
}
