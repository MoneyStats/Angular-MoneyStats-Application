import { Component, Input, OnInit } from '@angular/core';
import { Coin, CoinSymbol } from 'src/assets/core/data/class/coin';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ToastService } from 'src/assets/core/utils/toast.service';

@Component({
  selector: 'app-dashboard-wallet',
  templateUrl: './dashboard-wallet.component.html',
  styleUrls: ['./dashboard-wallet.component.scss'],
})
export class DashboardWalletComponent implements OnInit {
  @Input('dashboard') dashboard?: Dashboard;
  @Input('user') user?: User;
  value?: string = this.user?.value;

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.setValue();
  }

  setValue() {
    if (this.user?.value === Coin.EUR) this.value = CoinSymbol.EUR;
    else if (this.user?.value === Coin.EUR) this.value = CoinSymbol.EUR;
  }

  availableSoon() {
    this.toast.availableSoon();
  }
}
