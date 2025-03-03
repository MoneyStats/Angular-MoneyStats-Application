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
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import {
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { ChartService } from 'src/assets/core/utils/chart.service';

@Component({
  selector: 'app-investments-history',
  templateUrl: './investments-history.component.html',
  styleUrls: ['./investments-history.component.scss'],
  standalone: false,
})
export class InvestmentsHistoryComponent implements OnInit, OnChanges {
  amount: string = '******';
  @Input('hidden') hidden: boolean = false;
  @Input('cryptoResume') cryptoResume!: Map<string, CryptoDashboard>;
  @Input('cryptoHistory') cryptoHistory!: Map<number, CryptoDashboard>;
  @Input('cryptoCurrency') cryptoCurrency: string = '';
  @Input('cryptoAssets') cryptoAssets: Asset[] = [];
  @Input('cryptoWallets') cryptoWallets: Wallet[] = [];
  @Input('currentYear') currentYear: any = new Date().getFullYear();
  // History Tab
  totalList: Array<any> = [];
  totalMap: Map<string, any> = new Map<string, any>();
  balances: Array<number> = [];
  tableBalance: Array<any> = [];
  // END History Tab
  //isOperationPresent: boolean = false;
  operations: Operation[] = [];
  operationSelect?: Operation;

  public chartHistory?: Partial<ApexOptions>;
  public chartPie?: Partial<ApexOptions>;

  constructor(
    public cryptoService: CryptoService,
    private router: Router,
    private shared: SharedService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cryptoWallets'] && Utils.isNullOrEmpty(this.operations)) {
      this.isOperationsPresent();
    }
    this.getResume();
  }

  ngOnInit(): void {
    //this.getResume();
  }

  getResume() {
    this.tableBalance = [];
    this.balances = [];
    this.totalList = [];
    if (!Utils.isNullOrEmpty(this.cryptoHistory)) {
      this.cryptoHistory = this.shared.getCryptoHistoryData();
    }
    if (!Utils.isNullOrEmpty(this.cryptoHistory)) {
      if (this.cryptoHistory instanceof Map) {
        this.cryptoHistory.forEach((value: CryptoDashboard, key: number) => {
          this.tableBalance.push(this.tableCreate(key.toString(), value));
        });
      } else {
        Object.entries(this.cryptoHistory).forEach(([key, value]) => {
          this.tableBalance.push(this.tableCreate(key.toString(), value));
        });
      }
    }
    this.totalMap.set('History', this.totalList);
    this.renderChart();
  }

  renderChart() {
    this.chartPie = ChartService.appRenderChartPie(this.cryptoAssets);
    if (!Utils.isNullOrEmpty(this.totalMap))
      setTimeout(() => {
        this.chartHistory = ChartService.renderChartLineCategory(this.totalMap);
      }, 200);
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

  isOperationsPresent() {
    let foundOperation = false; // Variabile per tracciare se troviamo almeno una operazione

    if (!Utils.isNullOrEmpty(this.cryptoWallets)) {
      // Itera attraverso ogni wallet
      this.cryptoWallets.forEach((wallet: any) => {
        if (wallet.assets && wallet.assets.length > 0 && !foundOperation) {
          // Itera attraverso ogni asset del wallet
          wallet.assets.forEach((asset: any) => {
            if (asset.operations && asset.operations.length > 0) {
              foundOperation = true; // Trova almeno una operazione
            }
          });
        }
      });
    }

    return foundOperation; // Ritorna true se è stata trovata almeno una operazione, altrimenti false
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

  calculateTotalInvested() {
    let totalInvested = 0;
    this.cryptoAssets.forEach((asset) => {
      totalInvested += asset.invested;
    });
    return this.cryptoCurrency + ' ' + totalInvested.toFixed(2);
  }
}
