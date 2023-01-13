import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dashboard, Stats, Wallet } from '../data/class/dashboard.class';
import * as ApexCharts from 'apexcharts';
import { ApexOptions, ChartJSOptions } from '../data/constant/apex.chart';
import { ChartConfiguration, ChartOptions } from 'chart.js';

//declare var ApexCharts: any;

@Injectable({
  providedIn: 'root',
})
export class ChartJSService {
  environment = environment;
  BACKGROUND: Array<string> = [
    'rgba(98, 54, 255, 0.3)',
    'rgba(209, 25, 208, 0.3)',
    'rgba(187, 157, 247, 0.3)',
    'rgba(222, 52, 84, 0.3)',
    'rgba(64, 115, 6, 0.3)',
    'rgba(156, 65, 60, 0.3)',
    'rgba(242, 237, 10, 0.3)',
    'rgba(250, 92, 66, 0.3)',
    'rgba(87, 203, 84, 0.3)',
    'rgba(80, 2, 149, 0.3)',
    'rgba(247, 238, 220, 0.3)',
  ];
  constructor() {}

  renderChartLine(totalMap: Map<string, any>) {
    let labels: Array<string> = [];
    let datasets: Array<any> = [];
    let index = 0;
    totalMap.forEach((value: any, key: string) => {
      let historyBalance: Array<number> = [];
      let date: string = '';

      value.forEach((v: any) => {
        historyBalance.push(v.balance);
        if (index === 0) {
          labels.push(v.date);
        }
      });
      let dataset = {
        label: key,
        data: historyBalance,
        fill: true,
        tension: 0.5,
        borderColor: this.BACKGROUND[index],
        backgroundColor: this.BACKGROUND[index],
      };
      datasets.push(dataset);
      historyBalance = [];

      index++;
    });
    let lineChartData: ChartConfiguration<'line'>['data'] = {
      labels: labels,
      datasets: datasets,
    };

    let lineChartOptions: ChartOptions<'line'> = {
      responsive: false,
    };
    let lineChartLegend = true;
    let chartLine: ChartJSOptions = new ChartJSOptions();
    chartLine.lineChartData = lineChartData;
    chartLine.lineChartLegend = lineChartLegend;
    chartLine.lineChartOptions = lineChartOptions;
    return chartLine;
  }
}
