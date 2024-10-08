import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import {
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import {
  CryptoDashboard,
  Operation,
} from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'ng-apexcharts';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { Utils } from 'src/assets/core/services/config/utils.service';

@Component({
  selector: 'app-trading-resume',
  templateUrl: './trading-resume.component.html',
  styleUrls: ['./trading-resume.component.scss'],
})
export class TradingResumeComponent implements OnInit, OnChanges {
  public trading?: Partial<ApexOptions>;
  @Input('cryptoDashboard') cryptoDashboard: CryptoDashboard =
    new CryptoDashboard();
  @Input('wallets') wallets: Wallet[] = [];
  operations: Array<Operation> = [];

  walletsFilter: Wallet[] = [];
  invested: number = 0;

  constructor(public cryptoService: CryptoService, private router: Router) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterWallet();
    this.getOperations();
  }

  ngOnInit(): void {
    this.filterWallet();
  }

  filterWallet() {
    let wall = Utils.copyObject(this.wallets);
    if (wall) {
      this.walletsFilter = wall.filter(
        (w: any) => w.type == OperationsType.TRADING
      );
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
  }

  getOperations() {
    let totalInvested: number = 0;

    let operations: Operation[] = [];
    let wallets = Utils.copyObject(this.wallets);
    if (wallets)
      wallets.forEach((wallet: any) => {
        if (wallet.assets && wallet.assets.length > 0)
          wallet.assets.forEach((asset: any) => {
            if (wallet.type == OperationsType.TRADING) {
              totalInvested += asset.invested;
            }
            if (asset.operations && asset.operations.length > 0) {
              asset.operations = asset.operations.filter(
                (o: any) => o.type == OperationsType.TRADING
              );
              asset.operations.forEach((operation: any) => {
                operation.asset = asset;
                operation.wallet = wallet;
                if (operation.type != OperationsType.NEWINVESTMENT)
                  operation.assetSell = Utils.copyObject(
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
    if (ScreenService.screenWidth! <= 780) {
      this.trading = ChartService.renderTradingOperations(operations, [200]);
    } else
      this.trading = ChartService.renderTradingOperations(operations, [350]);
    this.getOperationTable(operations, totalInvested);
    return operations;
  }

  goToOperations() {
    let uuid = uuidv4();
    this.cryptoService.operationsMap.set(uuid, this.getOperations());
    this.router.navigate([
      '/crypto/operations/' + this.cryptoDashboard.currency + '/' + uuid,
    ]);
  }

  getOperationTable(operations: Array<Operation>, totalInvested: number) {
    let balance = totalInvested;
    let trendSum = 0;
    this.operations = Utils.copyObject(operations).filter(
      (o: any) => o.status == 'CLOSED'
    );
    this.operations.reverse().forEach((o) => {
      o.trendSum = parseFloat((trendSum += o.trend!).toFixed(2));
      o.balance = parseFloat((balance += o.trend!).toFixed(2));
    });
    this.operations.reverse();
    this.invested = totalInvested;
  }
}
