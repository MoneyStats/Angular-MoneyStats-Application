import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/assets/core/services/user.service';
import { StorageConstant } from 'src/assets/core/data/constant/constant';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

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
          if (httpEvent.headers.has('authToken')) {
            authToken = httpEvent.headers.get('authToken')!;
            localStorage.setItem(StorageConstant.ACCESSTOKEN, authToken);
          }
        }
      })
    );
  }
}
