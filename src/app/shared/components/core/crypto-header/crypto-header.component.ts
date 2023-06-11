import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from 'src/assets/core/services/user.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ModalConstant } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-crypto-header',
  templateUrl: './crypto-header.component.html',
  styleUrls: ['./crypto-header.component.scss'],
})
export class CryptoHeaderComponent implements OnInit {
  @Input('routerLinks') routerLinks?: string;
  @Input('title') title: string = 'Crypto';

  @Input('isMenuActive') isMenuActive: boolean = true;

  constructor(
    private location: Location,
    private router: Router,
    public userService: UserService,

  ) {
    router.events.subscribe((data: any) => {
      if (data.url == '/crypto/requirements') {
        this.isMenuActive = false;
      } else this.isMenuActive = true;
    });
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  goBack() {
    if (this.routerLinks != undefined) {
      this.router.navigate([this.routerLinks]);
    } else {
      this.location.back();
    }
  }

  logout() {
    this.userService.logout();
  }
}
