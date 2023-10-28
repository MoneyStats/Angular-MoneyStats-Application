import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CryptoDashboard } from 'src/assets/core/data/class/crypto.class';
import { Stats } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';

@Component({
  selector: 'app-resume-assets',
  templateUrl: './resume-assets.component.html',
  styleUrls: ['./resume-assets.component.scss'],
})
export class ResumeAssetsComponent implements OnInit, OnChanges {
  amount: string = '******';
  @Input('hidden') hidden: boolean = false;
  public chartOptions?: Partial<ApexOptions>;
  @Input('resumeData') resumeData: CryptoDashboard = new CryptoDashboard();
  //resume: Map<string, CryptoDashboard> = new Map<string, CryptoDashboard>();
  @Input('isPast') isPast: boolean = false;
  balances: Array<number> = [];
  filterDateHistory: string[] = [];

  resumeDataFilterOnDate: CryptoDashboard = new CryptoDashboard();

  tableBalance: Array<any> = [];
  constructor(
    private screenService: ScreenService,
    private charts: ChartService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.resumeData.assets) {
        this.resumeDataFilterOnDate = deepCopy(this.resumeData);
        if (!this.isPast)
          this.resumeDataFilterOnDate.assets =
            this.resumeDataFilterOnDate.assets.filter((a) => a.balance != 0);
        if (this.screenService?.screenWidth! <= 780) {
          this.chartOptions = this.charts.renderCryptoDatas(this.resumeData, [
            200,
            this.isPast,
          ]);
        } else
          this.chartOptions = this.charts.renderCryptoDatas(this.resumeData, [
            350,
            this.isPast,
          ]);
      }
    }, 100);
    this.renderTable();
  }
  renderTable() {
    this.tableBalance = [];
    this.balances = [];
    if (this.resumeData.statsAssetsDays) {
      //let moreThanOneInAMonth: Array<string> = [];
      this.resumeData.statsAssetsDays.forEach((date, index) => {
        let yearMonth: string = date.split('-')[0] + '-' + date.split('-')[1];

        //let find = moreThanOneInAMonth.find((d) => d.includes(yearMonth));
        //if (find && moreThanOneInAMonth.includes(find)) {
        //  moreThanOneInAMonth.pop();
        //  moreThanOneInAMonth.push(date);
        //} else {
        //  moreThanOneInAMonth.push(date);
        //}
        this.tableBalance.push(this.tableColumsCreate(date, index));
      });
      //moreThanOneInAMonth.forEach((date, index) => {
      //  this.tableBalance.push(this.tableColumsCreate(date, index));
      //});
      //this.dashboard.statsWalletDays = moreThanOneInAMonth;
    }
  }

  tableColumsCreate(date: string, index: number) {
    let array: any = [];

    this.resumeData.assets.forEach((a, index) => {
      let history = a.history?.find((h) => h.date.toString() === date);
      if (!history) {
        history = new Stats();
        history.balance = 0;
        history.date = new Date(date);
        history.percentage = 0;
        history.trend = 0;
      } else {
        let beforeThis = a.history?.find(
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
        if (index === this.resumeData.assets.length - 1) {
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
