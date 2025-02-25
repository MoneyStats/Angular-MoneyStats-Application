import { Component, OnDestroy, Output } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import {
  AccessSphereResponse,
  User,
} from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LOG } from 'src/assets/core/utils/log.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/assets/core/services/api/user.service';
import { ResponseModel } from 'src/assets/core/data/class/generic.class';
import { Utils } from 'src/assets/core/services/config/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent implements OnDestroy {
  updateUserSubscribe: Subscription = new Subscription();
  loginSubscribe: Subscription = new Subscription();
  authorizeSubscribe: Subscription = new Subscription();
  tokenSubscribe: Subscription = new Subscription();

  isPasswordShow: boolean = false;

  environment = environment;
  @Output('user') user?: User = new User();
  username: string = '';
  password: string = '';
  constructor(
    private location: Location,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.checkAndExchangeCodeForToken();
  }

  ngOnDestroy(): void {
    this.loginSubscribe.unsubscribe();
    this.tokenSubscribe.unsubscribe();
    this.authorizeSubscribe.unsubscribe();
    this.updateUserSubscribe.unsubscribe();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  goBack() {
    this.location.back();
  }

  login() {
    const user = this.authService.login(this.username, this.password);
    this.loginSubscribe = user.subscribe((data) => {
      LOG.info(data.message!, 'LoginComponent');
      this.userService.setUserGlobally(data.data);
      this.router.navigate(['']);
    });
  }

  authorize() {
    this.authorizeSubscribe = this.authService.authorize().subscribe((data) => {
      LOG.info('Google Authorize', 'LoginComponent');
      const url = data.headers.get('location');
      if (url) window.location.href = url;
    });
  }

  checkAndExchangeCodeForToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const token = this.authService.token(code);
      this.tokenSubscribe = token.subscribe((data) => {
        LOG.info(data.message!, 'LoginComponent');
        this.checkIfIsANewUserAndRedirect(data);
      });
    }
  }

  hideShowPassword() {
    this.isPasswordShow
      ? (this.isPasswordShow = false)
      : (this.isPasswordShow = true);
  }

  checkIfIsANewUserAndRedirect(response: ResponseModel) {
    const accessSphereResponse: AccessSphereResponse = Utils.copyObject(
      response.data
    );
    const user = accessSphereResponse.user;

    if (user && Utils.isNullOrEmpty(user.attributes)) {
      const storageAttributes = localStorage.getItem(
        StorageConstant.USER_ATTRIBUTES
      );

      if (storageAttributes) {
        user.attributes = JSON.parse(storageAttributes);

        // Aggiorna il token di accesso
        if (accessSphereResponse.token) {
          const { token_type, access_token } = accessSphereResponse.token;
          localStorage.setItem(
            StorageConstant.ACCESSTOKEN,
            `${token_type} ${access_token}`
          );
        }

        // Aggiorna l'utente
        this.updateUserSubscribe = this.authService
          .updateUserData(user)
          .subscribe((res) => {
            LOG.info(res.message ?? '', 'LoginComponent');
            this.userService.setUserGlobally({
              ...accessSphereResponse,
              user: res.data,
            });
            this.router.navigate(['']);
          });

        // Rimuove gli attributi temporanei
        localStorage.removeItem(StorageConstant.USER_ATTRIBUTES);
        return;
      }
    }

    // Se non è un nuovo utente o non ci sono attributi, setta i dati e reindirizza
    this.userService.setUserGlobally(response.data);
    this.router.navigate(['']);
  }
}
