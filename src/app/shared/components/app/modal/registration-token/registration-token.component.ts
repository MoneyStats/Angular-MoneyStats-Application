import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Coin } from 'src/assets/core/data/class/coin';
import { Status } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration-token',
  standalone: false,
  templateUrl: './registration-token.component.html',
  styleUrl: './registration-token.component.scss',
})
export class RegistrationTokenComponent {
  checkRegistrationCodeSubscribe: Subscription = new Subscription();
  authorizeSubscribe: Subscription = new Subscription();
  checkBox: boolean = false;
  invitationCode: string = '';

  currency: string = '';
  currencyList: string[] = Object.values(Coin);

  environment = environment;

  @Input('modalId') modalId: string = '';

  constructor(private authService: AuthService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.checkRegistrationCodeSubscribe.unsubscribe();
    this.authorizeSubscribe.unsubscribe();
  }

  authorize() {
    this.checkRegistrationCodeSubscribe = this.authService
      .checkRegistrationToken(this.invitationCode)
      .subscribe((res) => {
        LOG.info(res.message!, 'RegistrationTokenComponent');
        const registration_code = res.data.registration_token;
        this.authorizeSubscribe = this.authService
          .authorize(registration_code)
          .subscribe((data) => {
            LOG.info('Google Authorize', 'RegistrationTokenComponent');
            this.setNewUserAttributes();
            const url = data.headers.get('location');
            if (url) window.location.href = url;
          });
      });
  }

  setNewUserAttributes() {
    const attributes = {
      money_stats_settings: {
        currency: this.currency,
        liveWallets: Status.NOT_ACTIVE,
      },
    };
    localStorage.setItem(
      StorageConstant.USER_ATTRIBUTES,
      JSON.stringify(attributes)
    );
  }
}
