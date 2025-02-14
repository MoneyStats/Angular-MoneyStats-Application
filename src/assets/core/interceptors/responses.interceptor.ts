import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LOG } from '../utils/log.service';
import { WebService } from '../services/config/web.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Verifica se l'URL è diverso da '/v1/oAuth/token'
    if (!this.isRequestLogin(request)) {
      LOG.info('Setting tracing into storage', 'ResponseInterceptor');
      // Recupera i dati dai cookie o dagli header
      const additionalData = WebService.getAdditionalData();

      if (additionalData) {
        // Clona la richiesta e aggiunge i dati
        request = request.clone({
          setHeaders: {
            ...additionalData,
          },
        });
      }
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Recupera i dati dagli headers o dai cookie
          WebService.fetchDataFromResponse(event.headers);
        }
        return event; // Propaga l'evento
      }),
      catchError((err) => {
        throw err; // Propaga l'errore
      })
    );
  }

  private isRequestLogin(request: HttpRequest<any>) {
    return (
      request.url.includes('/v1/oAuth/token') &&
      request.params.has('grant_type') &&
      request.params.get('grant_type')?.includes('password')
    );
  }
}
