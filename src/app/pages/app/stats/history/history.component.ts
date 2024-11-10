import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
import {
  ApexOptions,
  ChartJSOptions,
} from 'src/assets/core/data/constant/apex.chart';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { ChartJSService } from 'src/assets/core/utils/chartjs.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnChanges {
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
  constructor() {}

  ngOnChanges(): void {
    if (
      !Utils.isNullOrEmpty(this.resume) &&
      Utils.isNullOrEmpty(this.totalMap)
    ) {
      this.resume.forEach((value: Dashboard, key: string) => {
        this.tableBalance.push(this.tableCreate(key, value));
      });
      this.totalMap.set('History', this.totalList);
      this.renderChart();
    }
  }

  renderChart() {
    this.lineChartJS = ChartJSService.renderChartLine(this.totalMap);
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

    if (Utils.isNullOrEmpty(total.balance)) {
      total.balance = 0;
    }
    total.percentage = parseFloat(percentage);
    if (Utils.isNullOrEmpty(total.percentage)) {
      total.percentage = 0;
    }
    total.trend = trend;
    if (Utils.isNullOrEmpty(total.trend)) {
      total.trend = 0;
    }
    array.push(total);
    this.totalList.push(total);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
}
