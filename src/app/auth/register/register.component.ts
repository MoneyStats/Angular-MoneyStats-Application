import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Coin } from 'src/assets/core/data/class/coin';
import { User } from 'src/assets/core/data/class/user.class';
import { UserService } from 'src/assets/core/services/user.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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
  constructor(
    private location: Location,
    private userService: UserService,
    private swal: SwalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currencyList = Object.values(Coin);
  }

  goBack() {
    this.location.back();
  }

  verifyPassword() {
    let validate = false;
    if (this.password != this.passwordAgain) {
      validate = true;
    }
    return validate;
  }

  register() {
    let user: User = new User();
    user.name = this.name;
    user.email = this.email;
    user.password = this.password;
    user.surname = this.surname;
    user.username = this.username;
    user.currency = this.currency;

    this.userService.register(user, this.invitationCode).subscribe((data) => {
      this.swal.toastMessage(SwalIcon.SUCCESS, data.message!);
      this.router.navigate(['auth/login']);
    });
  }
}
