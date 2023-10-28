import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  environment = environment;
  isLoading = new Subject<boolean>();
  shouldNotLoader: Array<string> = ['/crypto/dashboard', '/'];

  constructor(private router: Router) {}

  show() {
    if (
      this.shouldNotLoader.find(
        (f) => environment.subDomain + f == window.location.pathname
      )
    ) {
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
