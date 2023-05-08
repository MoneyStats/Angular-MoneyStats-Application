import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from 'src/assets/core/services/user.service';

@Component({
  selector: 'app-crypto-header',
  templateUrl: './crypto-header.component.html',
  styleUrls: ['./crypto-header.component.scss'],
})
export class CryptoHeaderComponent implements OnInit {
  @Input('routerLinks') routerLinks?: string;
  @Input('title') title: string = 'Crypto';

  isRequirementActive: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
    private userService: UserService
  ) {
    router.events.subscribe((data: any) => {
      if (data.url == '/crypto/requirements') {
        this.isRequirementActive = true;
      } else this.isRequirementActive = false;
    });
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
