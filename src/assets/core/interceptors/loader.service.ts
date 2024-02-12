import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  environment = environment;
  isLoading = new Subject<boolean>();
  shouldNotLoader: Array<string> = ['/crypto/dashboard', '/'];

  constructor() {}

  show() {
    let pathname =
      environment.subDomain == ''
        ? window.location.pathname
        : window.location.pathname.replace(environment.subDomain, '');
    if (this.shouldNotLoader.find((f) => f == pathname)) {
      this.isLoading.next(false);
    } else this.isLoading.next(true);
    const body = document.querySelector('body');
    body?.classList.add('loading');
  }

  hide() {
    this.isLoading.next(false);
    const body = document.querySelector('body');
    body?.classList.remove('loading');
  }
}
