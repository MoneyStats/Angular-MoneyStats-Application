import { Component, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/assets/core/services/user.service';
import { User } from 'src/assets/core/data/class/user.class';
import { StorageConstant } from 'src/assets/core/data/constant/modal.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
    const user = this.userService.getUser();
    user.subscribe(async (data) => {
      this.user = data;
      this.userService.user = data;
      this.userService.setValue();
      localStorage.setItem(
        StorageConstant.GITHUBACCOUNT,
        JSON.stringify(data.github)
      );
      localStorage.setItem(StorageConstant.ACCESSTOKEN, JSON.stringify(data));
      this.router.navigate(['']);
    });
  }
}
