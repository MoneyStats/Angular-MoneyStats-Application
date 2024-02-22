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

  public static isNullOrEmpty(obj: any) {
    if (obj != undefined && obj) {
      if (obj instanceof Number) return Number.isNaN(obj);
    }
    return true;
  }

  public static vibrate() {
    navigator.vibrate([5]);
  }

  private static copyParseObject(obj: any) {
    var db = JSON.stringify(obj);
    return JSON.parse(db);
  }
}
