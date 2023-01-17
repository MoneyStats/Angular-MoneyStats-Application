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
      return true;
    }
    this.router.navigate(['auth/login']);
    return false;
  }

  // Method to check user logged
  //isUserLoggedIn() {
  //  let accessToken = localStorage.getItem('accessToken');
  //  if (accessToken === null) {
  //    this.router.navigate(['auth/login']);
  //  } else {
  //    this.isUserLoggedSubscribe = this.authService
  //      .isUserLoggedIn(accessToken)
  //      .subscribe({
  //        next: (resp) => {
  //          this.user = <AuthenticationUser>resp;
  //        },
  //        error: (error) => {
  //          this.router.navigate(['auth/login']);
  //        },
  //      });
  //  }
  //}
  //
  //unsubscribe() {
  //  this.isUserLoggedSubscribe.unsubscribe();
  //}
}
