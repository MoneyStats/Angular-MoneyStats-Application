import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  Operations,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { deepCopy } from '@angular-devkit/core/src/utils/object';

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

  filterWallets: Wallet[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  isWalletPresent() {
    return this.walletSelect != undefined;
  }

  selectOperation(e: any) {
    let operation = e.target.value;
    let wallet = deepCopy(this.wallets);
    if (
      operation != OperationsType.NEWINVESTMENT &&
      operation != OperationsType.TRANSFER
    ) {
      this.filterWallets = wallet.filter((w) => w.type == e.target.value);
    } else this.filterWallets = wallet;
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
