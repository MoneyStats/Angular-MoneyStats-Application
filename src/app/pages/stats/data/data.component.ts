import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CoinSymbol } from 'src/assets/core/data/class/coin';
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

  constructor(private charts: ChartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.tableBalance = [];
    this.balances = [];
    if (this.dashboard.statsWalletDays) {
      let index = 0;
      this.dashboard.statsWalletDays.forEach((date) => {
        this.tableBalance.push(this.tableCreate(date, index));
        index++;
      });
      this.renderChart();
    }
  }

  ngOnInit(): void {
    this.tableBalance = [];
    this.balances = [];
    if (this.dashboard.statsWalletDays) {
      let index = 0;
      this.dashboard.statsWalletDays.forEach((date) => {
        this.tableBalance.push(this.tableCreate(date, index));
        index++;
      });
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
    }, 100);
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }

  tableCreate(date: string, index: number) {
    let array: any = [];
    this.dashboard.wallets.forEach((w) => {
      let history = w.history.find((h) => h.date.toString() === date);
      if (!history) {
        history = new Stats();
        history.balance = 0;
        history.date = new Date(date);
        history.percentage = 0;
        history.trend = 0;
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
