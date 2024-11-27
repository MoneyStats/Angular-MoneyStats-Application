import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Coin } from 'src/assets/core/data/class/coin';
import { Status, User } from 'src/assets/core/data/class/user.class';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { Router } from '@angular/router';
import { LOG } from 'src/assets/core/utils/log.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RegEx } from 'src/assets/core/data/constant/constant';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerSubscribe: Subscription = new Subscription();

  name: string = '';
  surname: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  passwordAgain: string = '';
  currency: string = '';
  currencyList: string[] = [];
  check: boolean = false;
  invitationCode: string = '';
  public EMPTY: string = '';

  isPasswordShow: boolean = false;

  constructor(
    private location: Location,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.registerSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.currencyList = Object.values(Coin);
  }

  goBack() {
    this.location.back();
  }

  validateRegexEmail() {
    const regex: RegExp = new RegExp(RegEx.EMAIL);
    // Se l' email è vuota non mostro l'errore
    return this.email != this.EMPTY ? regex.test(this.email) : true;
  }

  validateRegexPassword() {
    const regex: RegExp = new RegExp(RegEx.PASSWORD_FULL);
    // Se la password è vuota non mostro l'errore
    return this.password != this.EMPTY ? regex.test(this.password) : true;
  }

  checkIfPasswordMatch() {
    return this.password != this.EMPTY && this.passwordAgain != this.EMPTY
      ? this.password === this.passwordAgain
      : true;
  }

  register() {
    let user: User = new User();
    user.name = this.name;
    user.email = this.email;
    user.password = this.password;
    user.surname = this.surname;
    user.username = this.username;
    user.settings.currency = this.currency;
    user.settings.liveWallets = Status.NOT_ACTIVE;

    this.registerSubscribe = this.authService
      .register(user, this.invitationCode)
      .subscribe((data) => {
        LOG.info(data.message!, 'RegisterComponent');
        SwalService.toastMessage(
          SwalIcon.SUCCESS,
          this.translate
            .instant('response.register')
            .replace('$USER$', user.username)
        );
        this.router.navigate(['auth/login']);
      });
  }

  hideShowPassword() {
    this.isPasswordShow
      ? (this.isPasswordShow = false)
      : (this.isPasswordShow = true);
  }
}
