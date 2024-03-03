import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LOG {
  private environment = environment;
  private static LOG_Formatter: string =
    '[$DATE$] [$ENV$] [LOG] [$CLASS$]: $TEXT$';

  public static info(text: string, classType: string): void {
    console.log(
      this.LOG_Formatter.replace('$DATE$', new Date().toDateString())
        .replace('$ENV$', environment.envType)
        .replace('$CLASS$', classType)
        .replace('$TEXT$', text)
    );
  }
}
