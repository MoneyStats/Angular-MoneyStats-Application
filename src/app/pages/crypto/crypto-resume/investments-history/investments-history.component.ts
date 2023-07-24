import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Asset,
  CryptoDashboard,
  Operation,
} from 'src/assets/core/data/class/crypto.class';
import { Stats } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { ModalConstant } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-investments-history',
  templateUrl: './investments-history.component.html',
  styleUrls: ['./investments-history.component.scss'],
})
export class InvestmentsHistoryComponent implements OnInit, OnChanges {
  @Input('cryptoResume') cryptoResume!: Map<string, CryptoDashboard>;
  @Input('cryptoCurrency') cryptoCurrency: string = '';
  @Input('assets') assets: Asset[] = [];
  // History Tab
  totalList: Array<any> = [];
  totalMap: Map<string, any> = new Map<string, any>();
  balances: Array<number> = [];
  tableBalance: Array<any> = [];
  // END History Tab
  isOperationPresent: boolean = false;
  operations: Operation[] = [];
  operationSelect?: Operation;

  constructor(private cryptoService: CryptoService, private router: Router) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getResume();
    this.getOperations();
  }

  ngOnInit(): void {
    this.getOperations();
    //this.getResume();
  }

  getResume() {
    if (!this.cryptoResume) {
      this.cryptoResume = deepCopy(this.cryptoService.cryptoResume);
    }
    this.cryptoResume.forEach((value: CryptoDashboard, key: string) => {
      this.tableBalance.push(this.tableCreate(key, value));
    });
    this.totalMap.set('History', this.totalList);
  }

  /**
   * History Tab Section
   */
  tableCreate(date: string, dashboard: any) {
    let array: any = [];

    let total: any = new Stats();
    total.balance = dashboard.balance;
    total.date = date;

    let percentage = (
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
      100
    ).toFixed(2);
    let trend = parseFloat(
      (total.balance - this.balances[this.balances.length - 1]).toFixed(2)
    );

    if (Number.isNaN(total.balance) || total.balance == undefined) {
      total.balance = 0;
    }
    total.percentage = parseFloat(percentage);
    if (Number.isNaN(total.percentage)) {
      total.percentage = 0;
    }
    total.trend = trend;
    if (Number.isNaN(total.trend)) {
      total.trend = 0;
    }
    array.push(total);
    this.totalList.push(total);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
  /**
   * END History Tab Section
   */
  getOperations() {
    this.operations = [];
    let wallets = deepCopy(this.cryptoService.cryptoDashboard.wallets);
    wallets.forEach((wallet) => {
      if (wallet.assets && wallet.assets.length > 0)
        wallet.assets.forEach((asset) => {
          if (asset.operations && asset.operations.length > 0)
            asset.operations.forEach((operation) => {
              operation.asset = asset;
              operation.wallet = wallet;
              this.operations.push(operation);
            });
        });
    });
    this.operations.sort((a, b) => (a.exitDate! < b.exitDate! ? 1 : -1));
    if (this.operations.length > 0) this.isOperationPresent = true;
  }

  goToOperations() {
    let uuid = uuidv4();
    this.cryptoService.operationsMap.set(uuid, this.operations);
    this.router.navigate([
      '/crypto/operations/' + this.cryptoCurrency + '/' + uuid,
    ]);
  }

  selectOperation(operation: any) {
    this.operationSelect = operation;
  }
}
