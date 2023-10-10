import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from 'src/assets/core/services/user.service';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { AppService } from 'src/assets/core/services/app.service';

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
    public userService: UserService,
    private appService: AppService
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
    this.appService.vibrate();
  }
}
