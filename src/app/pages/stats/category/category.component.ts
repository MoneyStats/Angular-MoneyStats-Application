import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { map } from 'rxjs';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
//import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import {
  ApexOptions,
  ChartJSOptions,
} from 'src/assets/core/data/constant/apex.chart';
import { ChartJSService } from 'src/assets/core/utils/chartjs.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnChanges {
  @Input('dashboard') dashboard: Dashboard = new Dashboard();
  @Input('coinSymbol') coinSymbol: string = '';

  INVESTMENTS: string[] = ['Investments', 'Cryptocurrency'];
  CAPITAL: string[] = ['Cash', 'Bank Account', 'Debit Card'];
  SAVING: string[] = ['Save Account', 'Save'];
  DEBITS: string[] = ['Credit Card', 'Recurrence'];
  OTHER: string[] = ['Check', 'Other', 'Coupon'];

  KEY_INVESTMENTS: string = 'Investments';
  KEY_CAPITAL: string = 'Capital';
  KEY_SAVING: string = 'Saving';
  KEY_DEBITS: string = 'Recurrence';
  KEY_OTHER: string = 'Other';
  mapWalletCategory: Map<string, any> = new Map<string, any>();

  // categoryTableBalance used just to set data
  categoryTableBalance: Array<any> = [];
  balances: Array<number> = [];
  totalMap: Map<string, any> = new Map<string, any>();
  totalList: Array<any> = [];

  public lineChartJS?: ChartJSOptions = new ChartJSOptions();
  public chartCategory?: Partial<ApexOptions>;
  public chartBar?: Partial<ChartOptions>;
  constructor(private charts: ChartService, private chartsJS: ChartJSService) {}

  ngOnInit(): void {
    this.generateData();
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateData();
    this.renderChart();
  }

  renderChart() {
    this.lineChartJS = this.chartsJS.renderChartLine(this.totalMap);
    //setTimeout(() => {
    //  this.chartCategory = this.charts.renderChartLineCategory(this.totalMap);
    //}, 200);
  }

  generateData() {
    // INVESTMENTS
    this.categoryTableBalance = [];
    this.totalList = [];

    let table = this.dashboard.wallets.filter((wallet) =>
      this.INVESTMENTS.includes(wallet.category)
    );
    this.dashboard.statsWalletDays.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.mapWalletCategory.set(this.KEY_INVESTMENTS, this.categoryTableBalance);
    this.totalMap.set(this.KEY_INVESTMENTS, this.totalList);

    // CAPITAL
    this.categoryTableBalance = [];
    this.totalList = [];

    table = this.dashboard.wallets.filter((wallet) =>
      this.CAPITAL.includes(wallet.category)
    );
    this.dashboard.statsWalletDays.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.mapWalletCategory.set(this.KEY_CAPITAL, this.categoryTableBalance);
    this.totalMap.set(this.KEY_CAPITAL, this.totalList);

    // SAVING
    this.categoryTableBalance = [];
    this.totalList = [];

    table = this.dashboard.wallets.filter((wallet) =>
      this.SAVING.includes(wallet.category)
    );
    this.dashboard.statsWalletDays.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.mapWalletCategory.set(this.KEY_SAVING, this.categoryTableBalance);
    this.totalMap.set(this.KEY_SAVING, this.totalList);

    // DEBITS
    this.categoryTableBalance = [];
    this.totalList = [];

    table = this.dashboard.wallets.filter((wallet) =>
      this.DEBITS.includes(wallet.category)
    );
    this.dashboard.statsWalletDays.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.mapWalletCategory.set(this.KEY_DEBITS, this.categoryTableBalance);
    this.totalMap.set(this.KEY_DEBITS, this.totalList);

    // OTHER
    this.categoryTableBalance = [];
    this.totalList = [];

    table = this.dashboard.wallets.filter((wallet) =>
      this.OTHER.includes(wallet.category)
    );
    this.dashboard.statsWalletDays.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.mapWalletCategory.set(this.KEY_OTHER, this.categoryTableBalance);
    this.totalMap.set(this.KEY_OTHER, this.totalList);
  }

  tableCreate(date: string, wallet: any) {
    let array: any = [];
    let history: any = [];

    wallet.forEach((w: any) => {
      history.push(w.history.find((h: any) => h.date === date));
    });
    let total: any = new Stats();
    total.balance = 0;
    total.date = date;
    history.forEach((h: any) => {
      total.balance = total.balance + h.balance;
    });
    let percentage = (
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
      100
    ).toFixed(2);
    let trend = total.balance - this.balances[this.balances.length - 1];
    total.percentage = parseFloat(percentage);
    total.trend = trend;
    array.push(total);
    this.totalList.push(total);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
}
