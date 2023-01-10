import { Component, Input, OnInit } from '@angular/core';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  public chartOptions?: Partial<ChartOptions>;
  @Input('resume') resume: Map<string, Dashboard> = new Map<
    string,
    Dashboard
  >();
  balances: Array<number> = [];
  totalList: Array<any> = [];
  totalMap: Map<string, any> = new Map<string, any>();

  tableBalance: Array<any> = [];

  constructor(private charts: ChartService) {}

  ngOnInit(): void {
    this.resume.forEach((value: Dashboard, key: string) => {
      this.tableBalance.push(this.tableCreate(key, value));
    });
    this.totalMap.set('History', this.totalList);
    this.renderChart();
  }

  renderChart() {
    setTimeout(() => {
      this.chartOptions = this.charts.renderChartLineCategory(this.totalMap);
    }, 200);
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
