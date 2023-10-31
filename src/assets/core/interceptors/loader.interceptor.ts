import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.show();

    return (
      next
        .handle(request)
        //.pipe(finalize(() => setTimeout(() => this.loaderService.hide(), 5000)));
        .pipe(
          tap(
            async (event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                setTimeout(() => this.loaderService.hide(), 500);
              }
            },
            (err: any) => {
              setTimeout(() => this.loaderService.hide(), 500);
            }
          )
        )
    );
  }
}
