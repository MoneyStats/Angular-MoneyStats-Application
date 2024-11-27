import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  Operations,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { Utils } from 'src/assets/core/services/config/utils.service';

@Component({
    selector: 'app-add-crypto-operation',
    templateUrl: './add-crypto-operation.component.html',
    styleUrls: ['./add-crypto-operation.component.scss'],
    standalone: false
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
    let wallet = Utils.copyObject(this.wallets);
    if (
      operation != OperationsType.NEWINVESTMENT &&
      operation != OperationsType.TRANSFER &&
      !Utils.isNullOrEmpty(wallet)
    ) {
      this.filterWallets = wallet.filter((w: any) => w.type == e.target.value);
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
