import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { Utils } from 'src/assets/core/services/config/utils.service';

@Component({
  selector: 'app-crypto-header',
  templateUrl: './crypto-header.component.html',
  styleUrls: ['./crypto-header.component.scss'],
  standalone: false,
})
export class CryptoHeaderComponent {
  @Output('emitOperationClick') emitOperationClick =
    new EventEmitter<boolean>();
  @Input('routerLinks') routerLinks?: string;
  @Input('title') title: string = 'Crypto';

  @Input('isMenuActive') isMenuActive: boolean = true;
  @Input('isInfoActive') isInfoActive: boolean = false;

  @Output('emitInfo') emitInfo = new EventEmitter<string>();

  constructor(
    private location: Location,
    private router: Router,
    public userService: AuthService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  clickOperation(): void {
    this.emitOperationClick.emit(true);
  }

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
