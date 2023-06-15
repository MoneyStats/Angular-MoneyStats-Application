import { Component, Input, OnInit } from '@angular/core';
import { CryptoDashboard } from 'src/assets/core/data/class/crypto.class';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-resume-assets',
  templateUrl: './resume-assets.component.html',
  styleUrls: ['./resume-assets.component.scss'],
})
export class ResumeAssetsComponent implements OnInit {
  public chartOptions?: Partial<ApexOptions>;
  @Input('resumeData') resumeData: CryptoDashboard = new CryptoDashboard();
  //resume: Map<string, CryptoDashboard> = new Map<string, CryptoDashboard>();
  years: Array<string> = [];
  balances: Array<number> = [];
  filterDateHistory: string[] = [];

  tableBalance: Array<any> = [];
  constructor(
    private screenService: ScreenService,
    private charts: ChartService
  ) {}

  ngOnInit(): void {
    console.log(this.resumeData);
    // TODO: ix lato BE
    setTimeout(() => {
      if (this.resumeData.assets) {
        if (this.screenService?.screenWidth! <= 780) {
          this.chartOptions = this.charts.renderCryptoAsset(
            this.resumeData,
            200
          );
        } else
          this.chartOptions = this.charts.renderCryptoAsset(this.resumeData);
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
      console.log(history, date, a);
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
