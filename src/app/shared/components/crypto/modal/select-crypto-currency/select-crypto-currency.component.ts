import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/assets/core/data/class/user.class';
import { UserService } from 'src/assets/core/services/api/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-crypto-currency',
  templateUrl: './select-crypto-currency.component.html',
  styleUrls: ['./select-crypto-currency.component.scss'],
  standalone: false,
})
export class SelectCryptoCurrencyComponent {
  environment = environment;
  @Input('modalId') modalId: string = '';
  currency: string = '';
  @Output('emitAddCurrency') emitAddCurrency = new EventEmitter<User>();

  currencies: string[] = ['EUR', 'USD', 'GBP'];

  constructor() {}

  selectCurrency() {
    let user = UserService.getUserData();
    user.attributes.money_stats_settings.cryptoCurrency = this.currency;
    this.emitAddCurrency.emit(user);
    this.currency = '';
  }
}
