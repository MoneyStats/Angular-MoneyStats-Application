import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/assets/core/services/user.service';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  loginSubscribe: Subscription = new Subscription();

  environment = environment;
  @Output('user') user?: User = new User();
  username: string = '';
  password: string = '';
  constructor(
    private location: Location,
    private userService: UserService,
    private router: Router,
    private logger: LoggerService
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
    const user = this.userService.login(this.username, this.password);
    this.loginSubscribe = user.subscribe((data) => {
      this.logger.LOG(data.message!, 'LoginComponent');
      if (data.data.githubUser) {
        data.data.github = JSON.parse(data.data.githubUser);
        localStorage.setItem(
          StorageConstant.GITHUBACCOUNT,
          JSON.stringify(data.data.githubUser)
        );
      }
      this.user = data.data;
      this.userService.user = data.data;

      localStorage.setItem(
        StorageConstant.ACCESSTOKEN,
        data.data.authToken.type + ' ' + data.data.authToken.accessToken
      );
      this.userService.setValue();
      this.userService.setUserGlobally();
      this.router.navigate(['']);
    });
  }
}
