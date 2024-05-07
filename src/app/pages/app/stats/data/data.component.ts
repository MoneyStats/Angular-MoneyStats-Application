import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UserService } from 'dist/angular-moneystats/assets/core/services/user.service';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { Utils } from 'src/assets/core/services/config/utils.service';
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

  amount: string = '******';
  @Input('hidden') hidden: boolean = false;

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.renderTable();
  }

  ngOnInit(): void {}

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
    let dashboard = Utils.copyObject(this.dashboard);
    this.chartOptions = undefined;
    this.chartBar = undefined;
    this.chartPie = undefined;
    setTimeout(() => {
      this.chartOptions = ChartService.appRenderWalletPerformance(dashboard);
      this.chartPie = ChartService.appRenderChartPie(dashboard.wallets);
      this.chartBar = ChartService.appRenderChartBar(
        dashboard.statsWalletDays,
        this.balances
      );
    }, 500);
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
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
        total.balance = Utils.roundToTwoDecimalPlaces(
          total.balance + h.balance
        );
      }
    });
    let percentage = Utils.roundToTwoDecimalPlaces(
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
        100
    );
    total.percentage = percentage;

    if (Utils.isNullOrEmpty(total.percentage) || index == 0) {
      total.percentage = 0;
    }

    let trendStats: Stats = new Stats();
    let trend = Utils.roundToTwoDecimalPlaces(
      total.balance - this.balances[this.balances.length - 1]
    );
    trendStats.balance = trend;

    if (Utils.isNullOrEmpty(trendStats.balance)) {
      trendStats.balance = 0;
    }

    array.push(total);
    array.push(trendStats);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
}
