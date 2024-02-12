import { Component, Input, OnInit } from '@angular/core';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
import {
  ApexOptions,
  ChartJSOptions,
} from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ChartJSService } from 'src/assets/core/utils/chartjs.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  public chartOptions?: Partial<ApexOptions>;
  @Input('resume') resume: Map<string, Dashboard> = new Map<
    string,
    Dashboard
  >();
  @Input('coinSymbol') coinSymbol: string = '';
  balances: Array<number> = [];
  totalList: Array<any> = [];
  totalMap: Map<string, any> = new Map<string, any>();

  amount: string = '******';
  @Input('hidden') hidden: boolean = false;

  tableBalance: Array<any> = [];

  public lineChartJS?: ChartJSOptions = new ChartJSOptions();
  constructor(private charts: ChartService, private chartsJS: ChartJSService) {}

  ngOnInit(): void {
    this.resume.forEach((value: Dashboard, key: string) => {
      this.tableBalance.push(this.tableCreate(key, value));
    });
    this.totalMap.set('History', this.totalList);
    this.renderChart();
  }

  renderChart() {
    this.lineChartJS = this.chartsJS.renderChartLine(this.totalMap);
    //setTimeout(() => {
    //  this.chartOptions = this.charts.renderChartLineCategory(this.totalMap);
    //}, 200);
  }

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

    if (Number.isNaN(total.balance) || total.balance == undefined) {
      total.balance = 0;
    }
    total.percentage = parseFloat(percentage);
    if (Number.isNaN(total.percentage)) {
      total.percentage = 0;
    }
    total.trend = trend;
    if (Number.isNaN(total.trend)) {
      total.trend = 0;
    }
    array.push(total);
    this.totalList.push(total);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
}
