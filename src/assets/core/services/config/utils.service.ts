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
    if (obj != undefined) {
      if (typeof obj === 'number') return Number.isNaN(obj) || obj === Infinity;
      return obj == undefined;
    }
    return true;
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
}
