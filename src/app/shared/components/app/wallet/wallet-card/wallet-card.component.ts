import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';

@Component({
  selector: 'app-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss'],
})
export class WalletCardComponent implements OnInit {
  @Input('coinSymbol') coinSymbol?: string;
  @Input('wallet') wallet?: Wallet;
  @Input('btn') btn?: string;
  @Input('style') style: string = '';
  @Input('hiddenAmount') hiddenAmount: boolean = false;
  amount: string = '******';
  constructor() {}

  ngOnInit(): void {}
}
