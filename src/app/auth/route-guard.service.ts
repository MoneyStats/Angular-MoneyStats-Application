import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { StorageConstant } from 'src/assets/core/data/constant/constant';
import { UserService } from 'src/assets/core/services/api/user.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService implements CanActivate {
  isUserLoggedSubscribe: Subscription = new Subscription();
  resp: Response | undefined;
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let accessToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    if (accessToken != null) {
      this.isUserLoggedIn(accessToken);
      return true;
    }
    this.router.navigate(['auth/login']);
    return false;
  }

  isUserLoggedIn(accessToken: string) {
    this.authService.checkLogin(accessToken).subscribe({
      next: (resp) => {
        this.userService.setUserGlobally(resp.data);
        /*       if (resp.data.githubUser) {
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
        );*/
        //this.router.navigate(['']);
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
