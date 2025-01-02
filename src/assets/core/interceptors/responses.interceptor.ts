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

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Verifica se l'URL è diverso da '/v1/oAuth/token'
    if (!request.url.includes('/v1/oAuth/token')) {
      // Recupera i dati dai cookie o dagli header
      const additionalData = this.getAdditionalData();

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
          this.fetchDataFromResponse(event.headers);
        }
        return event; // Propaga l'evento
      }),
      catchError((err) => {
        throw err; // Propaga l'errore
      }),
    );
  }

  private fetchDataFromResponse(headers: HttpHeaders) {
    // Leggi i dati dai cookie o dagli header
    const parentId = this.getCookie('Parent-ID') || headers.get('Parent-ID');
    const redirectUri = this.getCookie('redirect-uri') || headers.get('redirect-uri');
    const sessionId = this.getCookie('Session-ID') || headers.get('Session-ID');
    const spanId = this.getCookie('Span-ID') || headers.get('Span-ID');
    const traceId = this.getCookie('Trace-ID') || headers.get('Trace-ID');

    // Salva i dati nel localStorage
    if (parentId) localStorage.setItem('Parent-ID', parentId);
    if (redirectUri) localStorage.setItem('redirect-uri', redirectUri);
    if (sessionId) localStorage.setItem('Session-ID', sessionId);
    if (spanId) localStorage.setItem('Span-ID', spanId);
    if (traceId) localStorage.setItem('Trace-ID', traceId);
  }

  private getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  }

  private getAdditionalData(): { [key: string]: string } | null {
    // Recupera i dati salvati in localStorage
    const parentId = localStorage.getItem('Parent-ID');
    const redirectUri = localStorage.getItem('redirect-uri');
    const sessionId = localStorage.getItem('Session-ID');
    const spanId = localStorage.getItem('Span-ID');
    const traceId = localStorage.getItem('Trace-ID');

    // Costruisce un oggetto con i dati disponibili
    const additionalData: { [key: string]: string } = {};
    if (parentId) additionalData['Parent-ID'] = parentId;
    if (redirectUri) additionalData['redirect-uri'] = redirectUri;
    if (sessionId) additionalData['Session-ID'] = sessionId;
    if (spanId) additionalData['Span-ID'] = spanId;
    if (traceId) additionalData['Trace-ID'] = traceId;

    // Ritorna i dati solo se almeno uno è presente
    return Object.keys(additionalData).length ? additionalData : null;
  }
}
