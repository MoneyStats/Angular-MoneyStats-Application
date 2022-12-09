import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilsException } from '../data/class/error';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public exception: UtilsException = new UtilsException();
  environment = environment;
  constructor(private http: HttpClient) {}

  throwException() {
    return this.http.get<any>('environment.getDashboardDataUrl');
  }

  throwException1(error: any) {
    this.exception.statusCode = error.status;
    this.exception.message = error.message;
    this.exception.exceptionCode = error.name;
  }
}
