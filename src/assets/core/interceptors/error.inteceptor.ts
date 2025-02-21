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
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorCode, ErrorCodeLogout } from '../data/class/error';
import { AuthService } from '../services/api/auth.service';
import { ErrorService } from './error.service';
import { UserService } from '../services/api/user.service';
import { LOG } from '../utils/log.service';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private errorService: ErrorService,
    private authService: AuthService,
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
          console.log(errorMsg, error);
          this.errorService.getError(error);
          let errorCode = this.errorService.exception.error?.errorCode;

          // Try Refresh if error is AUTH_TOKEN_NOT_VALID
          if (
            errorCode === ErrorCode.Authentication ||
            (error.url && error.url.includes('/authorize'))
          )
            return this.tryRefreshToken(request, next);

          if (
            this.isErrorCodeIncluded(errorCode!) ||
            error.status == HttpStatusCode.GatewayTimeout
          ) {
            if (error.url && !error.url.includes('/logout')) {
              this.authService.logout();
              return throwError(() => new Error(errorMsg));
            }
          } else {
            this.router.navigate(['error']);
            return throwError(() => new Error(errorMsg));
          }
        }
        if (error.url && !error.url.includes('/logout')) {
          this.authService.logout();
          return throwError(() => new Error(errorMsg));
        } else {
          this.router.navigate(['error']);
          return throwError(() => new Error(errorMsg));
        }
      })
    );
  }

  // Se matcha uno di questi deve effetture la logout
  // TODO: Controlla gli errori nel BE per generalizzare il più possibile
  isErrorCodeIncluded(value: string): boolean {
    return Object.values(ErrorCodeLogout).includes(value as ErrorCodeLogout);
  }

  tryRefreshToken(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshToken().pipe(
      switchMap((resp) => {
        if (resp.status === 200) {
          LOG.info(resp.message!, 'ErrorInterceptor');
          this.userService.setUserGlobally(resp.data);

          // Aggiorna il token e riprova la richiesta originale
          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${resp.data.token.access_token}`,
            },
          });

          return next.handle(clonedRequest).pipe(
            catchError((error) => {
              // Se la richiesta fallisce dopo il refresh, fai logout
              LOG.info(
                'Request failed after token refresh',
                'ErrorInterceptor'
              );
              this.authService.logout();
              return throwError(
                () => new Error('Session expired, logging out')
              );
            })
          );
        }
        // Se la refresh fallisce, esegui il logout
        this.authService.logout();
        return throwError(() => new Error('Session expired, logging out'));
      }),
      catchError((error) => {
        // Gestisce errori della richiesta di refresh token
        LOG.info('Refresh token request failed', 'ErrorInterceptor');
        this.authService.logout();
        return throwError(() => new Error('Session expired, logging out'));
      })
    );
  }
}
