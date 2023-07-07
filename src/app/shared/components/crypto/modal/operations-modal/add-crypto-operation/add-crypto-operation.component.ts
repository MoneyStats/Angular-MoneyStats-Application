import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { Operations } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-add-crypto-operation',
  templateUrl: './add-crypto-operation.component.html',
  styleUrls: ['./add-crypto-operation.component.scss'],
})
export class AddCryptoOperationComponent implements OnInit {
  @Input('wallets') wallets: Wallet[] = [];
  @Input('fiat') fiat?: string;

  operations: string[] = Operations;

  // NG MODEL
  operationSelect: string = '';
  walletSelect?: string;

  // Boolean for buttons
  isOperationSel: boolean = false;
  isWalletSelected: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  isWalletPresent() {
    return this.walletSelect != undefined;
  }
}
