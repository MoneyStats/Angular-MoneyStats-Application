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
    req: import('@angular/common/http').HttpRequest<any>,
    next: import('@angular/common/http').HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((httpEvent: HttpEvent<any>) => {
        // Skip request
        if (httpEvent.type === 0) {
          return;
        }
        console.log('response: ', httpEvent);

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
