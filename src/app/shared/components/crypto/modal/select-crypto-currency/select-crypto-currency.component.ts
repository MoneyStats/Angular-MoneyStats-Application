import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/assets/core/services/user.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-crypto-currency',
  templateUrl: './select-crypto-currency.component.html',
  styleUrls: ['./select-crypto-currency.component.scss'],
})
export class SelectCryptoCurrencyComponent implements OnDestroy {
  updateUserSub: Subscription = new Subscription();

  environment = environment;
  @Input('modalId') modalId: string = '';
  currency: string = '';
  @Output('emitAddCurrency') emitAddCurrency = new EventEmitter<string>();

  currencies: string[] = ['EUR', 'USD', 'GBP'];

  constructor(
    private userService: UserService,
    private logger: LoggerService
  ) {}

  ngOnDestroy(): void {
    this.updateUserSub.unsubscribe();
  }

  selectCurrency() {
    let user = this.userService.user;
    user.settings.cryptoCurrency = this.currency;
    this.updateUserSub = this.userService
      .updateUserData(user)
      .subscribe((data) => {
        this.logger.LOG(data.message!, 'SettingsComponent');
        this.userService.user = data.data;
        this.userService.setUserGlobally();
        this.emitAddCurrency.emit(this.currency);
        this.currency = '';
      });
  }
}
