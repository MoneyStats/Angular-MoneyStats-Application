import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
          console.log('this is server side error');
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          console.log(errorMsg);
          this.errorService.getError(error);

          switch (this.errorService.exception.error?.exceptionCode) {
            case 'ERR_AUTH_MSS_004':
              console.log('logout');
              this.userService.logout();
              break;
            default:
              console.log('default_error');
              this.router.navigate(['error']);
              break;
          }
        }
        return throwError(errorMsg);
      })
    );
  }
}
