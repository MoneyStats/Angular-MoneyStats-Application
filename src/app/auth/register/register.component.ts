import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Coin } from 'src/assets/core/data/class/coin';
import { User } from 'src/assets/core/data/class/user.class';

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
  constructor(private location: Location) {}

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
    user.value = this.currency;
    console.log(user);
  }
}
