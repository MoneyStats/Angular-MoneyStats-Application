import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit, OnChanges {
  public chartOptions?: Partial<ChartOptions>;
  public chartPie?: Partial<ChartOptions>;
  public chartBar?: Partial<ChartOptions>;
  @Input('dashboard') dashboard: Dashboard = new Dashboard();
  balances: Array<number> = [];
  tableBalance: Array<any> = [];

  constructor(private charts: ChartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.renderChart();
    this.tableBalance = [];
    this.dashboard.statsWalletDays.forEach((date) => {
      this.tableBalance.push(this.tableCreate(date));
    });
  }

  ngOnInit(): void {
    this.renderChart();
    this.tableBalance = [];
    this.dashboard.statsWalletDays.forEach((date) => {
      this.tableBalance.push(this.tableCreate(date));
    });
  }

  renderChart() {
    setTimeout(() => {
      this.chartOptions = this.charts.renderChartLine(this.dashboard);
      this.chartPie = this.charts.renderChartPie(this.dashboard.wallets);
      this.chartBar = this.charts.renderChartBar(
        this.dashboard.statsWalletDays,
        this.dashboard.statsBalances
      );
    }, 100);
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }

  tableCreate(date: string) {
    let array: any = [];
    this.dashboard.wallets.forEach((w) => {
      let history = w.history.find((h) => h.date === date);
      array.push(history);
    });
    let total: Stats = new Stats();
    total.balance = 0;
    total.date = date;
    array.forEach((h: any) => {
      total.balance = total.balance + h.balance;
    });
    let percentage = (
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
      100
    ).toFixed(2);
    total.percentage = parseFloat(percentage);
    array.push(total);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
}
