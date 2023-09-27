import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { Router } from '@angular/router';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import {
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import {
  Asset,
  CryptoDashboard,
  Operation,
} from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';

@Component({
  selector: 'app-trading-resume',
  templateUrl: './trading-resume.component.html',
  styleUrls: ['./trading-resume.component.scss'],
})
export class TradingResumeComponent implements OnInit, OnChanges {
  @Input('cryptoDashboard') cryptoDashboard: CryptoDashboard =
    new CryptoDashboard();
  @Input('wallets') wallets: Wallet[] = [];

  walletsFilter: Wallet[] = [];

  constructor(public cryptoService: CryptoService, private router: Router) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterWallet();
  }

  ngOnInit(): void {
    this.filterWallet();
  }

  filterWallet() {
    let wall = deepCopy(this.wallets);
    this.walletsFilter = wall.filter((w) => w.type == OperationsType.TRADING);
    this.walletsFilter.forEach((w) => {
      if (w.assets && w.assets.length > 0)
        w.assets.forEach((a) => {
          if (a.operations && a.operations.length > 0)
            a.operations = a.operations.filter(
              (o) => o.type == OperationsType.TRADING
            );
        });
    });
  }

  getOperations() {
    let operations: Operation[] = [];
    let wallets = deepCopy(this.wallets);
    wallets.forEach((wallet) => {
      if (wallet.assets && wallet.assets.length > 0)
        wallet.assets.forEach((asset) => {
          if (asset.operations && asset.operations.length > 0) {
            asset.operations = asset.operations.filter(
              (o) => o.type == OperationsType.TRADING
            );
            asset.operations.forEach((operation) => {
              operation.asset = asset;
              operation.wallet = wallet;
              if (operation.type != OperationsType.NEWINVESTMENT)
                operation.assetSell = deepCopy(
                  this.cryptoService.cryptoDashboard.assets.find(
                    (a) => a.symbol == operation.entryCoin
                  )
                );
              operations.push(operation);
            });
          }
        });
    });
    operations = operations.filter((o) => o.type == OperationsType.TRADING);
    operations.sort((a, b) => (a.entryDate! < b.entryDate! ? 1 : -1));
    return operations;
  }

  goToOperations() {
    let uuid = uuidv4();
    this.cryptoService.operationsMap.set(uuid, this.getOperations());
    this.router.navigate([
      '/crypto/operations/' + this.cryptoDashboard.currency + '/' + uuid,
    ]);
  }
}
