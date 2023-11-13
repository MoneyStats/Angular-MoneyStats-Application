import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit, OnChanges {
  public chartOptions?: Partial<ApexOptions>;
  public chartPie?: Partial<ApexOptions>;
  public chartBar?: Partial<ApexOptions>;
  @Input('dashboard') dashboard: Dashboard = new Dashboard();
  @Input('coinSymbol') coinSymbol: string = '';
  balances: Array<number> = [];
  tableBalance: Array<any> = [];
  filterDateHistory: string[] = [];

  constructor(private charts: ChartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.renderTable();
  }

  ngOnInit(): void {
    this.renderTable();
  }

  renderTable() {
    this.tableBalance = [];
    this.balances = [];
    if (this.dashboard.statsWalletDays) {
      let moreThanOneInAMonth: Array<string> = [];
      this.dashboard.statsWalletDays.forEach((date, index) => {
        let yearMonth: string = date.split('-')[0] + '-' + date.split('-')[1];

        let find = moreThanOneInAMonth.find((d) => d.includes(yearMonth));
        if (find && moreThanOneInAMonth.includes(find)) {
          moreThanOneInAMonth.pop();
          moreThanOneInAMonth.push(date);
        } else {
          moreThanOneInAMonth.push(date);
        }
      });
      moreThanOneInAMonth.forEach((date, index) => {
        this.tableBalance.push(this.tableColumsCreateRefactor(date, index));
      });
      this.tableBalance = this.tableBalance.reverse();
      //this.dashboard.statsWalletDays = moreThanOneInAMonth;
      this.renderChart();
    }
  }

  renderChart() {
    setTimeout(() => {
      this.chartOptions = this.charts.renderChartLine(this.dashboard);
      this.chartPie = this.charts.renderChartPie(this.dashboard.wallets);
      this.chartBar = this.charts.renderChartBar(
        this.dashboard.statsWalletDays,
        this.balances
      );
    }, 500);
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }

  /**
   * @deprecated
   * @param date
   * @param index
   * @returns
   */
  tableColumsCreate(date: string, index: number) {
    let array: any = [];

    this.dashboard.wallets.forEach((w, index) => {
      let history = w.history
        ? w.history.find((h) => h.date.toString() === date)
        : undefined;
      if (!history) {
        history = new Stats();
        history.balance = 0;
        history.date = new Date(date);
        history.percentage = 0;
        history.trend = 0;
      } else {
        let beforeThis = w.history.find(
          (h) =>
            h.date.toString() ===
            this.filterDateHistory[this.filterDateHistory.length - 1]
        );
        if (beforeThis) {
          history.percentage = parseFloat(
            (
              ((history.balance - beforeThis.balance) / beforeThis.balance) *
              100
            ).toFixed(2)
          );
          history.trend = parseFloat(
            (history.balance - beforeThis.balance).toFixed(2)
          );
        } else {
          history.percentage = 0;
          history.trend = 0;
        }
        if (index === this.dashboard.wallets.length - 1) {
          this.filterDateHistory.push(history.date.toString());
        }
      }
      array.push(history);
    });
    let total: Stats = new Stats();
    total.balance = 0;
    total.date = new Date(date);
    array.forEach((h: any) => {
      if (h && h.balance != undefined && h.balance) {
        total.balance = parseFloat((total.balance + h.balance).toFixed(2));
      }
    });
    let percentage = (
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
      100
    ).toFixed(2);
    total.percentage = parseFloat(percentage);

    if (
      total.percentage === Infinity ||
      Number.isNaN(total.percentage) ||
      index == 0
    ) {
      total.percentage = 0;
    }

    let trendStats: Stats = new Stats();
    let trend = (
      total.balance - this.balances[this.balances.length - 1]
    ).toFixed(2);
    trendStats.balance = parseFloat(trend);

    if (Number.isNaN(trendStats.balance)) {
      trendStats.balance = 0;
    }

    array.push(total);
    array.push(trendStats);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }

  tableColumsCreateRefactor(date: string, index: number) {
    let array: any = [];

    this.dashboard.wallets.forEach((w, index) => {
      let history = w.history
        ? w.history.find((h) => h.date.toString() === date)
        : undefined;
      if (!history) {
        history = new Stats();
        history.balance = 0;
        history.date = new Date(date);
        history.percentage = 0;
        history.trend = 0;
      } else {
        if (index === this.dashboard.wallets.length - 1) {
          this.filterDateHistory.push(history.date.toString());
        }
      }
      array.push(history);
    });
    let total: Stats = new Stats();
    total.balance = 0;
    total.date = new Date(date);
    array.forEach((h: any) => {
      if (h && h.balance != undefined && h.balance) {
        total.balance = parseFloat((total.balance + h.balance).toFixed(2));
      }
    });
    let percentage = (
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
      100
    ).toFixed(2);
    total.percentage = parseFloat(percentage);

    if (
      total.percentage === Infinity ||
      Number.isNaN(total.percentage) ||
      index == 0
    ) {
      total.percentage = 0;
    }

    let trendStats: Stats = new Stats();
    let trend = (
      total.balance - this.balances[this.balances.length - 1]
    ).toFixed(2);
    trendStats.balance = parseFloat(trend);

    if (Number.isNaN(trendStats.balance)) {
      trendStats.balance = 0;
    }

    array.push(total);
    array.push(trendStats);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
}
