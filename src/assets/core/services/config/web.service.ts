import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LOG } from '../../utils/log.service';
import { LanguagesSettings, Tracing } from '../../data/constant/constant';
import { Utils } from './utils.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  environment = environment;

  public static fetchDataFromResponse(headers: HttpHeaders) {
    // Leggi i dati dai cookie o dagli header
    const parentId =
      this.getCookie(Tracing.PARENT_ID) || headers.get(Tracing.PARENT_ID);
    const redirectUri =
      this.getCookie(Tracing.REDIRECT_URI) || headers.get(Tracing.REDIRECT_URI);
    const sessionId =
      this.getCookie(Tracing.SESSION_ID) || headers.get(Tracing.SESSION_ID);
    const spanId =
      this.getCookie(Tracing.SPAN_ID) || headers.get(Tracing.SPAN_ID);
    const traceId =
      this.getCookie(Tracing.TRACE_ID) || headers.get(Tracing.TRACE_ID);
    const registrationToken =
      this.getCookie(Tracing.REGISTRATION_TOKEN) ||
      headers.get(Tracing.REGISTRATION_TOKEN);

    // Salva i dati nel localStorage
    if (parentId) localStorage.setItem(Tracing.PARENT_ID, parentId);
    if (redirectUri) localStorage.setItem(Tracing.REDIRECT_URI, redirectUri);
    if (sessionId) localStorage.setItem(Tracing.SESSION_ID, sessionId);
    if (spanId) localStorage.setItem(Tracing.SPAN_ID, spanId);
    if (traceId) localStorage.setItem(Tracing.TRACE_ID, traceId);
    if (registrationToken)
      localStorage.setItem(Tracing.REGISTRATION_TOKEN, registrationToken);
  }

  private static getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  }

  public static getAdditionalData(): { [key: string]: string } | null {
    // Recupera i dati salvati in localStorage
    const parentId =
      this.getCookie(Tracing.PARENT_ID) ||
      localStorage.getItem(Tracing.PARENT_ID);
    const redirectUri =
      this.getCookie(Tracing.REDIRECT_URI) ||
      localStorage.getItem(Tracing.REDIRECT_URI);
    const sessionId =
      this.getCookie(Tracing.SESSION_ID) ||
      localStorage.getItem(Tracing.SESSION_ID);
    const spanId =
      this.getCookie(Tracing.SPAN_ID) || localStorage.getItem(Tracing.SPAN_ID);
    const traceId =
      this.getCookie(Tracing.TRACE_ID) ||
      localStorage.getItem(Tracing.TRACE_ID);
    const registrationToken =
      this.getCookie(Tracing.REGISTRATION_TOKEN) ||
      localStorage.getItem(Tracing.REGISTRATION_TOKEN);

    // Costruisce un oggetto con i dati disponibili
    const additionalData: { [key: string]: string } = {};
    if (parentId) additionalData[Tracing.PARENT_ID] = parentId;
    if (redirectUri) additionalData[Tracing.REDIRECT_URI] = redirectUri;
    if (sessionId) additionalData[Tracing.SESSION_ID] = sessionId;
    if (spanId) additionalData[Tracing.SPAN_ID] = spanId;
    if (traceId) additionalData[Tracing.TRACE_ID] = traceId;
    if (registrationToken)
      additionalData[Tracing.REGISTRATION_TOKEN] = registrationToken;

    // Ritorna i dati solo se almeno uno è presente
    return Object.keys(additionalData).length ? additionalData : null;
  }

  public static logoutStorage() {
    const language = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);
    localStorage.clear();
    if (!Utils.isNullOrEmpty(language))
      localStorage.setItem(LanguagesSettings.ATTR_LANGUAGE, language!);
  }

  public static getFromSession(name: string) {
    const data = sessionStorage.getItem(name);
    if (data) return JSON.parse(data);
    return null;
  }

  public static setInSession(name: string, value: any) {
    try {
      sessionStorage.setItem(name, JSON.stringify(value));
    } catch (e: any) {
      LOG.info(
        'Error on saving in session, message: ' + e.message,
        'UtilsService'
      );
      return;
    }
  }

  public static removeFromSession(name: string) {
    sessionStorage.removeItem(name);
  }

  public static getBrowserVersion(userAgent: any): string {
    let browserVersion = 'Unknown';

    // Chrome
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
      const chromeVersion = userAgent.match(/Chrome\/([0-9.]+)/);
      if (chromeVersion) browserVersion = chromeVersion[1];
    }
    // Firefox
    else if (userAgent.includes('Firefox')) {
      const firefoxVersion = userAgent.match(/Firefox\/([0-9.]+)/);
      if (firefoxVersion) browserVersion = firefoxVersion[1];
    }
    // Safari
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      const safariVersion = userAgent.match(/Version\/([0-9.]+)/);
      if (safariVersion) browserVersion = safariVersion[1];
    }

    return browserVersion;
  }
}
