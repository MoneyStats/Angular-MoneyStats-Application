import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/assets/core/data/class/user.class';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-crypto-currency',
  templateUrl: './select-crypto-currency.component.html',
  styleUrls: ['./select-crypto-currency.component.scss'],
})
export class SelectCryptoCurrencyComponent {
  environment = environment;
  @Input('modalId') modalId: string = '';
  currency: string = '';
  @Output('emitAddCurrency') emitAddCurrency = new EventEmitter<User>();

  currencies: string[] = ['EUR', 'USD', 'GBP'];

  constructor(private userService: AuthService) {}

  selectCurrency() {
    let user = this.userService.user;
    user.settings.cryptoCurrency = this.currency;
    this.emitAddCurrency.emit(user);
    this.currency = '';
  }
}
