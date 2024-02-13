import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from 'src/assets/core/services/user.service';
import { StorageConstant } from 'src/assets/core/data/constant/constant';

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
      //if (this.authService.user.name === 'DEFAULT_NAME') {
      //  this.isUserLoggedIn(accessToken);
      //}
      this.isUserLoggedIn(accessToken);
      return true;
    }
    this.router.navigate(['auth/login']);
    return false;
  }

  isUserLoggedIn(accessToken: string) {
    this.authService.checkLogin(accessToken).subscribe({
      next: (resp) => {
        if (resp.data.githubUser) {
          resp.data.github = JSON.parse(resp.data.githubUser);
        }
        this.authService.user = resp.data;
        this.authService.setUserGlobally();
        this.authService.setValue();
        localStorage.setItem(
          StorageConstant.USERACCOUNT,
          JSON.stringify(resp.data)
        );
        localStorage.setItem(
          StorageConstant.ACCESSTOKEN,
          'Bearer ' + resp.data.authToken.accessToken
        );
        this.router.navigate(['']);
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
