import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/assets/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-crypto-currency',
  templateUrl: './select-crypto-currency.component.html',
  styleUrls: ['./select-crypto-currency.component.scss'],
})
export class SelectCryptoCurrencyComponent implements OnInit {
  environment = environment;
  @Input('modalId') modalId: string = '';
  currency: string = '';
  @Output('emitAddCurrency') emitAddCurrency = new EventEmitter<string>();

  currencies: string[] = ['EUR', 'USD', 'GBP'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  selectCurrency() {
    let user = this.userService.user;
    user.settings.cryptoCurrency = this.currency;
    this.userService.updateUserData(user).subscribe((data) => {
      this.userService.user = data.data;
      this.userService.setUserGlobally();
      this.emitAddCurrency.emit(this.currency);
      this.currency = '';
    });
  }
}
