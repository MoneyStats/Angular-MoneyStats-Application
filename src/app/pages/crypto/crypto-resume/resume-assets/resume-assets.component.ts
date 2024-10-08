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
import { Utils } from 'src/assets/core/services/config/utils.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

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
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getDatas();
  }

  ngOnInit(): void {}

  getDatas() {
    this.resumeData.holdingLong.trend =
      this.resumeData.holdingLong.balance /
      (1 + this.resumeData.holdingLong.performance / 100);
    setTimeout(() => {
      if (this.resumeData.assets) {
        this.resumeDataFilterOnDate = Utils.copyObject(this.resumeData);
        if (!this.isPast)
          this.resumeDataFilterOnDate.assets =
            this.resumeDataFilterOnDate.assets.filter((a) => a.balance != 0);
        if (ScreenService.screenWidth! <= 780) {
          this.chartOptions = ChartService.renderCryptoDatas(this.resumeData, [
            200,
            this.isPast,
          ]);
        } else
          this.chartOptions = ChartService.renderCryptoDatas(this.resumeData, [
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
        this.tableBalance.push(this.tableColumsCreateRefactor(date, index));
      });
      //moreThanOneInAMonth.forEach((date, index) => {
      //  this.tableBalance.push(this.tableColumsCreate(date, index));
      //});
      //this.dashboard.statsWalletDays = moreThanOneInAMonth;
    }
  }

  tableColumsCreateRefactor(date: string, index: number) {
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

    if (Utils.isNullOrEmpty(total.percentage) || index == 0) {
      total.percentage = 0;
    }

    let trendStats: Stats = new Stats();
    let trend = (
      total.balance - this.balances[this.balances.length - 1]
    ).toFixed(2);
    trendStats.balance = parseFloat(trend);

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
