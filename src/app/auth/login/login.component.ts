import { Component, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/assets/core/services/user.service';
import { User } from 'src/assets/core/data/class/user.class';
import { StorageConstant } from 'src/assets/core/data/constant/constant';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  environment = environment;
  @Output('user') user?: User = new User();
  username: string = '';
  password: string = '';
  constructor(
    private location: Location,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  login() {
    const user = this.userService.login(this.username, this.password);
    user.subscribe((data) => {
      if (data.data.githubUser) {
        data.data.github = JSON.parse(data.data.githubUser);
      }
      this.user = data.data;
      this.userService.user = data.data;
      localStorage.setItem(
        StorageConstant.GITHUBACCOUNT,
        JSON.stringify(data.data.githubUser)
      );
      localStorage.setItem(
        StorageConstant.ACCESSTOKEN,
        data.data.authToken.accessToken
      );
      this.userService.setValue();
      this.userService.setUserGlobally();
      this.router.navigate(['']);
    });
  }
}
