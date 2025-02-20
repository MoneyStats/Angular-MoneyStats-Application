import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { StorageConstant } from 'src/assets/core/data/constant/constant';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { environment } from 'src/environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { LOG } from 'src/assets/core/utils/log.service';
import { UserService } from 'src/assets/core/services/api/user.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  environment = environment;
  isUserLoggedSubscribe: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private readonly updates: SwUpdate
  ) {
    this.checkUpdates();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let authToken = JSON.parse(
      localStorage.getItem(StorageConstant.AUTHTOKEN)!
    );
    let user = JSON.parse(localStorage.getItem(StorageConstant.USERACCOUNT)!);
    if (!Utils.isNullOrEmpty(user) && user.mockedUser) return true;
    if (authToken != null && user != null) {
      this.validateAccessToken(user, authToken);
      return true;
    }
    this.router.navigate(['auth/login']);
    return false;
  }

  checkUpdates() {
    LOG.info('Looking for updates...', 'RouteGuardService');
    this.updates.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        LOG.info(
          'New version available, preparing to update...',
          'AppComponent'
        );
        this.doAppUpdate();
      }
    });
  }

  private async doAppUpdate() {
    try {
      await this.updates.activateUpdate();
      LOG.info('Update activated. Reloading the page...', 'RouteGuardService');
      window.location.reload();
    } catch (error) {
      LOG.info('Error activating update', 'RouteGuardService');
    }
  }

  validateAccessToken(user: any, authToken: any) {
    if (!Utils.isNullOrEmpty(authToken.access_token)) {
      const now = Date.now(); // Tempo attuale in millisecondi

      // Se non è già stato calcolato, calcoliamo la soglia di rinnovo UNA SOLA VOLTA
      if (!authToken.expirationThreshold)
        this.calculateExpirationThreshold(now, authToken);

      const expirationTime = authToken.expires_at - now;
      const shouldRefresh = expirationTime < 5 * 60 * 1000; // Refresh se mancano meno di 2 minuti

      // Se il tempo rimanente è inferiore alla soglia, eseguiamo il refresh
      if (shouldRefresh) {
        return this.tryRefreshToken();
      }

      if (now < authToken.expirationThreshold) {
        LOG.info(
          'Token is valid, Next Validation: ' +
            new Date(authToken.expirationThreshold).toLocaleTimeString() +
            ' Expires At: ' +
            new Date(authToken.expires_at).toLocaleTimeString() +
            ', skipping authorize',
          'RouteGuardService'
        );
        return true;
      }

      this.authService
        .authorizeCheck(authToken.access_token)
        .subscribe((resp) => {
          if (resp.status === 200) {
            this.calculateExpirationThreshold(now, authToken);
            return true;
          }
          //if (resp.status === 401) return this.tryRefreshToken();
          return false;
        });
    }
    return false;
  }

  tryRefreshToken() {
    return this.authService.refreshToken().subscribe({
      next: (resp) => {
        LOG.info(resp.message!, 'RouteGuardService');
        this.userService.setUserGlobally(resp.data);
        if (resp.status == 200) {
          return true;
        }
        return false;
      },
      error: (error) => {
        this.authService.logout();
        return false;
      },
    });
  }

  calculateExpirationThreshold(now: any, authToken: any) {
    const expirationTime = authToken.expires_at - now;
    let updatedAuthToken = JSON.parse(
      localStorage.getItem(StorageConstant.AUTHTOKEN)!
    );
    updatedAuthToken.expirationThreshold = now + expirationTime / 3;
    localStorage.setItem(
      StorageConstant.AUTHTOKEN,
      JSON.stringify(updatedAuthToken)
    );
  }

  //tryRefreshToken() {
  //  return this.authService.refreshToken().subscribe({
  //    next: (resp) => {
  //      console.log('REFRESH', resp);
  //      LOG.info(resp.message!, 'RouteGuardService');
  //      this.userService.setUserGlobally(resp.data);
  //      if (resp.status == 200) return true;
  //      return false;
  //    },
  //    error: (error) => {
  //      console.log('REFRESH', error);
  //      this.router.navigate(['auth/login']);
  //      return false;
  //    },
  //  });
  //}

  unsubscribe() {
    this.isUserLoggedSubscribe.unsubscribe();
  }
}
