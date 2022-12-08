import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilsException } from '../data/class/error';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  exception: UtilsException = new UtilsException();
  environment = environment;
  constructor(private http: HttpClient) {}

  throwException() {
    this.exception.status = 404;
    this.exception.message = 'Error Exception Message';
    this.exception.exception = 'EXC_DEF_001';
    return this.http.get<any>('environment.getDashboardDataUrl');
  }
}
