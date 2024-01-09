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

          if (
            this.isExceptionCodeIncluded(exceptionCode!) ||
            error.status == HttpStatusCode.GatewayTimeout
          ) {
            this.userService.logout();
            return throwError(() => new Error(errorMsg));
          } else {
            this.router.navigate(['error']);
            return throwError(() => new Error(errorMsg));
          }
        }
        this.userService.logout();
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  isExceptionCodeIncluded(value: string): boolean {
    return Object.values(ExceptionCode).includes(value as ExceptionCode);
  }
}
