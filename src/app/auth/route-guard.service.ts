import { Subscription } from 'rxjs';
import { Injectable, Output, EventEmitter } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from 'src/assets/core/services/user.service';
import { StorageConstant } from 'src/assets/core/data/constant/modal.constant';
import { User } from 'src/assets/core/data/class/user.class';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService implements CanActivate {
  isUserLoggedSubscribe: Subscription = new Subscription();
  resp: Response | undefined;
  constructor(private router: Router, private authService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let accessToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    if (accessToken != null) {
      if (this.authService.user.name === 'DEFAULT_NAME') {
        this.isUserLoggedIn(accessToken);
      }
      return true;
    }
    this.router.navigate(['auth/login']);
    return false;
  }

  isUserLoggedIn(accessToken: string) {
    this.authService.checkLogin(accessToken).subscribe({
      next: (resp) => {
        this.authService.user = resp.data;
        this.authService.setUserGlobally();
        this.authService.setValue();
      },
      error: (error) => {
        this.router.navigate(['auth/login']);
      },
    });
  }

  unsubscribe() {
    this.isUserLoggedSubscribe.unsubscribe();
  }
}
