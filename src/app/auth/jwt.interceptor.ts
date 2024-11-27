import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageConstant } from 'src/assets/core/data/constant/constant';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((httpEvent: HttpEvent<any>) => {
        // Skip request
        if (httpEvent.type === 0) {
          return;
        }
        let authToken: string;
        if (httpEvent instanceof HttpResponse) {
          if (httpEvent.headers.has('Authorization')) {
            authToken = httpEvent.headers.get('Authorization')!;
            localStorage.setItem(
              StorageConstant.ACCESSTOKEN,
              'Bearer ' + authToken
            );
          }
        }
      })
    );
  }
}
