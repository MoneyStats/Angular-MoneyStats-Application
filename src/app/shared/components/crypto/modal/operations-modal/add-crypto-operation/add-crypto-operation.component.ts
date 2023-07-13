import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { Operations } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-add-crypto-operation',
  templateUrl: './add-crypto-operation.component.html',
  styleUrls: ['./add-crypto-operation.component.scss'],
})
export class AddCryptoOperationComponent implements OnInit {
  @Input('wallets') wallets: Wallet[] = [];
  @Input('assets') assets: Asset[] = [];
  @Input('fiat') fiat?: string;

  operations: string[] = Operations;

  // NG MODEL
  operationSelect: string = '';
  walletSelect?: string;

  // Boolean for buttons
  isOperationSel: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  isWalletPresent() {
    return this.walletSelect != undefined;
  }

  selectWallet() {
    this.router.navigate([
      'crypto/operation/' +
        this.operationSelect +
        '/' +
        this.walletSelect +
        '/' +
        this.fiat,
    ]);
  }
}
