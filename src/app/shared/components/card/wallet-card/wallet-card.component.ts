import { Component, Input, OnInit } from '@angular/core';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { WalletService } from 'src/assets/core/services/wallet.service';

@Component({
  selector: 'app-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss'],
})
export class WalletCardComponent implements OnInit {
  @Input('wallet') wallet?: Wallet;
  @Input('btn') btn?: string;
  constructor() {}

  ngOnInit(): void {}
}
