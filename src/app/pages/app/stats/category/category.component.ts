import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
import { ChartOptions } from 'chart.js';
import {
  ApexOptions,
  ChartJSOptions,
} from 'src/assets/core/data/constant/apex.chart';
import { ChartJSService } from 'src/assets/core/utils/chartjs.service';
import { Utils } from 'src/assets/core/services/config/utils.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnChanges {
  @Input('dashboard') dashboard: Dashboard = new Dashboard();
  @Input('coinSymbol') coinSymbol: string = '';

  amount: string = '******';
  @Input('hidden') hidden: boolean = false;

  INVESTMENTS: string[] = ['Investments', 'Crypto'];
  CAPITAL: string[] = ['Cash', 'Bank Account', 'Debit Card'];
  SAVING: string[] = ['Save Account', 'Save'];
  DEBITS: string[] = ['Credit Card', 'Recurrence'];
  OTHER: string[] = ['Check', 'Other', 'Coupon'];

  KEY_INVESTMENTS: string = 'Investments';
  KEY_CAPITAL: string = 'Capital';
  KEY_SAVING: string = 'Saving';
  KEY_DEBITS: string = 'Recurrence';
  KEY_OTHER: string = 'Others';
  mapWalletCategory: Map<string, any> = new Map<string, any>();

  // categoryTableBalance used just to set data
  categoryTableBalance: any = [];
  balances: Array<number> = [];
  totalMap: Map<string, any> = new Map<string, any>();
  totalList: Array<any> = [];

  public lineChartJS?: ChartJSOptions = new ChartJSOptions();
  public chartCategory?: Partial<ApexOptions>;
  public chartBar?: Partial<ChartOptions>;
  constructor() {}

  ngOnInit(): void {
    if (this.dashboard.statsWalletDays) {
      this.generateData();
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dashboard.statsWalletDays) {
      this.generateData();
      this.renderChart();
    }
  }

  renderChart() {
    this.lineChartJS = ChartJSService.renderChartLine(this.totalMap);
  }

  generateData() {
    let moreThanOneInAMonth: Array<string> = [];
    if (this.dashboard.statsWalletDays) {
      this.dashboard.statsWalletDays.forEach((date) => {
        let yearMonth: string = date.split('-')[0] + '-' + date.split('-')[1];

        let find = moreThanOneInAMonth.find((d) => d.includes(yearMonth));
        if (find && moreThanOneInAMonth.includes(find)) {
          moreThanOneInAMonth.pop();
          moreThanOneInAMonth.push(date);
        } else {
          moreThanOneInAMonth.push(date);
        }
      });
    }
    // INVESTMENTS
    this.categoryTableBalance = [];
    this.totalList = [];
    this.balances = [];

    let table = this.dashboard.wallets.filter((wallet) =>
      this.INVESTMENTS.includes(wallet.category)
    );
    moreThanOneInAMonth.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.categoryTableBalance.forEach((c: any) => {
      if (c.data) {
        this.categoryTableBalance.data = true;
      }
    });
    this.mapWalletCategory.set(
      this.KEY_INVESTMENTS,
      this.categoryTableBalance.reverse()
    );
    this.totalMap.set(this.KEY_INVESTMENTS, this.totalList);

    // CAPITAL
    this.categoryTableBalance = [];
    this.totalList = [];
    this.balances = [];

    table = this.dashboard.wallets.filter((wallet) =>
      this.CAPITAL.includes(wallet.category)
    );
    moreThanOneInAMonth.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.categoryTableBalance.forEach((c: any) => {
      if (c.data) {
        this.categoryTableBalance.data = true;
      }
    });
    this.mapWalletCategory.set(
      this.KEY_CAPITAL,
      this.categoryTableBalance.reverse()
    );
    this.totalMap.set(this.KEY_CAPITAL, this.totalList);

    // SAVING
    this.categoryTableBalance = [];
    this.totalList = [];
    this.balances = [];

    table = this.dashboard.wallets.filter((wallet) =>
      this.SAVING.includes(wallet.category)
    );
    moreThanOneInAMonth.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.categoryTableBalance.forEach((c: any) => {
      if (c.data) {
        this.categoryTableBalance.data = true;
      }
    });
    this.mapWalletCategory.set(
      this.KEY_SAVING,
      this.categoryTableBalance.reverse()
    );
    this.totalMap.set(this.KEY_SAVING, this.totalList);

    // DEBITS
    this.categoryTableBalance = [];
    this.totalList = [];
    this.balances = [];

    table = this.dashboard.wallets.filter((wallet) =>
      this.DEBITS.includes(wallet.category)
    );
    moreThanOneInAMonth.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.categoryTableBalance.forEach((c: any) => {
      if (c.data) {
        this.categoryTableBalance.data = true;
      }
    });
    this.mapWalletCategory.set(
      this.KEY_DEBITS,
      this.categoryTableBalance.reverse()
    );
    this.totalMap.set(this.KEY_DEBITS, this.totalList);

    // OTHER
    this.categoryTableBalance = [];
    this.totalList = [];
    this.balances = [];

    table = this.dashboard.wallets.filter((wallet) =>
      this.OTHER.includes(wallet.category)
    );
    moreThanOneInAMonth.forEach((date) => {
      this.categoryTableBalance.push(this.tableCreate(date, table));
    });
    this.categoryTableBalance.forEach((c: any) => {
      if (c.data) {
        this.categoryTableBalance.data = true;
      }
    });
    this.mapWalletCategory.set(
      this.KEY_OTHER,
      this.categoryTableBalance.reverse()
    );
    this.totalMap.set(this.KEY_OTHER, this.totalList);
  }

  tableCreate(date: string, wallet: any) {
    let array: any = [];
    let history: any = [];

    wallet.forEach((w: any) => {
      let hist = w.history
        ? w.history.find((h: any) => h.date === date)
        : undefined;
      if (!hist) {
        hist = new Stats();
        hist.balance = 0;
        hist.date = date;
        hist.percentage = 0;
        hist.trend = 0;
      }
      history.push(hist);
    });
    let total: any = new Stats();
    total.balance = 0;
    total.date = date;
    history.forEach((h: any) => {
      total.balance = Utils.roundToTwoDecimalPlaces(total.balance + h.balance);
    });
    let percentage = Utils.roundToTwoDecimalPlaces(
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
        100
    );
    let trend = Utils.roundToTwoDecimalPlaces(
      total.balance - this.balances[this.balances.length - 1]
    );
    total.percentage = percentage;
    total.trend = trend;
    if (Utils.isNullOrEmpty(total.percentage)) {
      total.percentage = 0;
      total.trend = 0;
    }
    array.push(total);
    this.totalList.push(total);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    array.data = true;

    if (total.balance === 0) {
      array.data = false;
    }
    return array;
  }
}
