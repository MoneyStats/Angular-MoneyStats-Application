import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { deepCopy } from '@angular-devkit/core/src/utils/object';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  environment = environment;

  constructor() {}

  public static copyObject(obj: any) {
    try {
      return deepCopy(obj);
    } catch {
      return this.copyParseObject(obj);
    }
  }

  public static isNullOrEmpty(obj: any): boolean {
    if (obj === undefined || obj === null) return true;

    if (typeof obj === 'number') {
      return Number.isNaN(obj) || obj === Infinity;
    }

    if (typeof obj === 'string') {
      return obj.trim().length === 0;
    }

    if (Array.isArray(obj)) {
      return obj.length === 0;
    }

    if (obj instanceof Map || obj instanceof Set) {
      return obj.size === 0;
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).length === 0;
    }

    return false;
  }

  public static roundToTwoDecimalPlaces(value: number): number {
    if (this.isNullOrEmpty(value)) return 0;
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  public static vibrate() {
    navigator.vibrate([5]);
  }

  private static copyParseObject(obj: any) {
    var db = JSON.stringify(obj);
    return JSON.parse(db);
  }

  public static getFromSession(name: string) {
    const data = sessionStorage.getItem(name);
    if (data) return JSON.parse(data);
    return null;
  }

  public static setInSession(name: string, value: any) {
    sessionStorage.setItem(name, JSON.stringify(value));
  }

  public static removeFromSession(name: string) {
    sessionStorage.removeItem(name);
  }

  public static formatDateIntl(inputDate: string) {
    const [day, month, year] = inputDate.split('/');
    const date = new Date(`${year}-${month}-${day}`);

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
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
