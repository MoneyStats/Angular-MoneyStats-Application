import { Component, Input, OnInit } from '@angular/core';
import { Stats } from 'src/assets/core/data/class/dashboard.class';
import { UserService } from 'src/assets/core/services/api/user.service';

@Component({
    selector: 'app-wallet-history-card',
    templateUrl: './wallet-history.component.html',
    styleUrls: ['./wallet-history.component.scss'],
    standalone: false
})
export class WalletHistoryCardComponent implements OnInit {
  @Input('stats') stats?: Stats;
  coinSymbol?: string;

  amount: string = '******';
  @Input('hidden') hidden: boolean = false;

  ngOnInit(): void {
    this.coinSymbol = UserService.getUserData().settings.currencySymbol;
  }
}
