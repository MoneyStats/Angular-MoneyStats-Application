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
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import {
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { ChartJSOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartJSService } from 'src/assets/core/utils/chartjs.service';
import { Utils } from 'src/assets/core/services/config/utils.service';

@Component({
  selector: 'app-investments-history',
  templateUrl: './investments-history.component.html',
  styleUrls: ['./investments-history.component.scss'],
})
export class InvestmentsHistoryComponent implements OnInit, OnChanges {
  amount: string = '******';
  @Input('hidden') hidden: boolean = false;
  @Input('cryptoResume') cryptoResume!: Map<string, CryptoDashboard>;
  @Input('cryptoCurrency') cryptoCurrency: string = '';
  assets: Asset[] = [];
  // History Tab
  totalList: Array<any> = [];
  totalMap: Map<string, any> = new Map<string, any>();
  balances: Array<number> = [];
  tableBalance: Array<any> = [];
  // END History Tab
  isOperationPresent: boolean = false;
  operations: Operation[] = [];
  operationSelect?: Operation;

  public lineChartJS?: ChartJSOptions = new ChartJSOptions();

  constructor(public cryptoService: CryptoService, private router: Router) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
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
    this.tableBalance = [];
    if (!this.cryptoResume) {
      this.cryptoResume = Utils.copyObject(this.cryptoService.cryptoResume);
    }
    this.cryptoResume.forEach((value: CryptoDashboard, key: string) => {
      this.tableBalance.push(this.tableCreate(key, value));
    });
    this.totalMap.set('History', this.totalList);
    this.renderChart();
  }

  renderChart() {
    setTimeout(() => {
      this.lineChartJS = ChartJSService.renderChartLine(this.totalMap);
    }, 500);
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

    if (Utils.isNullOrEmpty(total.balance)) {
      total.balance = 0;
    }
    total.percentage = parseFloat(percentage);
    if (Utils.isNullOrEmpty(total.percentage)) {
      total.percentage = 0;
    }
    total.trend = trend;
    if (Utils.isNullOrEmpty(total.trend)) {
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
    let assets = Utils.copyObject(this.cryptoService.cryptoDashboard.assets);
    this.assets = assets.filter((a: any) => a.balance > 0);
    this.operations = [];
    let wallets = Utils.copyObject(this.cryptoService.cryptoDashboard.wallets);
    if (!Utils.isNullOrEmpty(wallets))
      wallets.forEach((wallet: any) => {
        if (wallet.assets && wallet.assets.length > 0)
          wallet.assets.forEach((asset: any) => {
            if (asset.operations && asset.operations.length > 0)
              asset.operations.forEach((operation: any) => {
                operation.asset = asset;
                operation.wallet = wallet;
                if (operation.type != OperationsType.NEWINVESTMENT)
                  operation.assetSell = Utils.copyObject(
                    this.cryptoService.cryptoDashboard.assets.find(
                      (a) => a.symbol == operation.entryCoin
                    )
                  );
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
