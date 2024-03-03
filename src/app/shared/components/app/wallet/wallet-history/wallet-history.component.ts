import { Component, Input, OnInit } from '@angular/core';
import { Stats } from 'src/assets/core/data/class/dashboard.class';
import { WalletService } from 'src/assets/core/services/api/wallet.service';

@Component({
  selector: 'app-wallet-history-card',
  templateUrl: './wallet-history.component.html',
  styleUrls: ['./wallet-history.component.scss'],
})
export class WalletHistoryCardComponent implements OnInit {
  @Input('stats') stats?: Stats;
  coinSymbol?: string;

  amount: string = '******';
  @Input('hidden') hidden: boolean = false;

  constructor(public walletService: WalletService) {}

  ngOnInit(): void {
    this.coinSymbol = this.walletService.coinSymbol;
  }
}
