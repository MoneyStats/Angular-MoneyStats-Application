import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { Utils } from 'src/assets/core/services/config/utils.service';

@Component({
  selector: 'app-crypto-header',
  templateUrl: './crypto-header.component.html',
  styleUrls: ['./crypto-header.component.scss'],
})
export class CryptoHeaderComponent implements OnInit {
  @Input('routerLinks') routerLinks?: string;
  @Input('title') title: string = 'Crypto';

  @Input('isMenuActive') isMenuActive: boolean = true;
  @Input('isInfoActive') isInfoActive: boolean = false;

  @Output('emitInfo') emitInfo = new EventEmitter<string>();

  constructor(
    private location: Location,
    private router: Router,
    public userService: AuthService
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
    this.vibrate();
    if (this.routerLinks != undefined) {
      this.router.navigate([this.routerLinks]);
    } else {
      this.location.back();
    }
  }

  logout() {
    this.userService.logout();
  }

  goToInfo() {
    this.emitInfo.emit('go');
  }
  vibrate() {
    Utils.vibrate();
  }
}
