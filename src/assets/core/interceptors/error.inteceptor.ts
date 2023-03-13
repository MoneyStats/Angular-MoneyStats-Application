import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExceptionCode } from '../data/class/error';
import { UserService } from '../services/user.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private errorService: ErrorService,
    private userService: UserService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('this is client side error');
          errorMsg = `Error: ${error.error.message}`;
          this.router.navigateByUrl('error');
        } else {
          console.log('this is server side error', 'New Update');
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          console.log(errorMsg, error);
          this.errorService.getError(error);
          let exceptionCode = this.errorService.exception.error?.exceptionCode;
          console.log(
            'Exception Code',
            exceptionCode,
            this.errorService.exception
          );

          if (error.status == HttpStatusCode.GatewayTimeout) {
            console.log('Number');
          }

          if (
            exceptionCode == ExceptionCode.Authentication ||
            error.status == HttpStatusCode.GatewayTimeout
          ) {
            console.log(window.location.href, 'logout');
            this.userService.logout();
            console.log(window.location.href, this.router.url);
          } else {
            console.log('Error', error);
            this.router.navigate(['error']);
          }
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
