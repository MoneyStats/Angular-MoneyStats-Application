import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { errorCode, UtilsException } from '../data/class/error';
import { Error } from '../data/class/error';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public exception: UtilsException = new UtilsException();
  environment = environment;
  constructor(private translateService: TranslateService) {}

  getError(error: any) {
    if (error.error != null && error.error.error) {
      this.mapError(error);
    } else {
      this.getUnknowError(error);
    }
  }

  mapError(error: any) {
    this.exception = error.error;
    this.exception.error!.statusCode = error.status;
    let exceptionMap: Record<string, any> =
      this.translateService.instant('exception');

    let errorCode = this.exception.error?.errorCode!;

    if (exceptionMap.hasOwnProperty(errorCode)) {
      // Puoi accedere alla traduzione direttamente usando la chiave
      const error = exceptionMap[errorCode];
      // Assegna il messaggio tradotto all'oggetto UtilsException
      this.exception.error!.message = error.message;
      this.exception.error!.status = error.status;
      this.exception.error!.exception = error.exception;
    }
  }

  getUnknowError(error: any) {
    this.exception.url = error.url;
    this.exception.dateTime = new Date();
    let errorModel: Error = new Error();
    errorModel.errorCode = errorCode.GenericException;
    errorModel.message = error.message;
    errorModel.statusCode = HttpStatusCode.InternalServerError;
    errorModel.exception = error.statusText;
    this.exception.error = errorModel;
    this.mapError(error);
  }

  handleWalletStatsError() {
    this.exception.url = '/stats/insert';
    this.exception.dateTime = new Date();
    let errorModel: Error = new Error();
    errorModel.errorCode = 'WALLET_DATA_ERROR';
    errorModel.message =
      'This error appeared cause you have been try to add a Stats with a date before a wallet was created, try different date!';
    errorModel.statusCode = HttpStatusCode.BadRequest;
    //errorModel.exception = 'error.statusText';
    this.exception.error = errorModel;
  }
}
