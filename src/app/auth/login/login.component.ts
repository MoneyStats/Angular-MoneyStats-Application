import { Component, OnDestroy, Output } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { User } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LOG } from 'src/assets/core/utils/log.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/assets/core/services/api/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  loginSubscribe: Subscription = new Subscription();

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
  ) {}

  ngOnDestroy(): void {
    this.loginSubscribe.unsubscribe();
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

  hideShowPassword() {
    this.isPasswordShow
      ? (this.isPasswordShow = false)
      : (this.isPasswordShow = true);
  }
}
