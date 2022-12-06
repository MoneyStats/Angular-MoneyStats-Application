import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dashboard, Wallet } from '../data/class/dashboard.class';

declare var ApexCharts: any;

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  environment = environment;
  constructor() {}

  render(dashboard: Dashboard) {
    let series: Array<any> = [];
    dashboard.wallets.forEach((wallet) => {
      let historyBalance: Array<number> = [];
      wallet.history.forEach((h) => {
        historyBalance.push(h.balance);
      });
      let serie = {
        name: wallet.name,
        data: historyBalance,
      };
      series.push(serie);
      historyBalance = [];
    });
    chartLine(series, dashboard.statsWalletDays);
  }
}
function chartLine(series: any, data: Array<string>) {
  var optionChartLine = {
    series: series,
    chart: {
      type: 'area',
      width: '100%',
      height: '350px',
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 2,
    },
    colors: [
      '#6236FF',
      '#d119d0',
      '#bb9df7',
      '#de3454',
      '#407306',
      '#9c413c',
      '#f2ed0a',
      '#fa5c42',
      '#57cb54',
      '#500295',
      '#f7eedc',
    ],
    labels: data,
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      floating: false,
      fontFamily: 'Helvetica, Arial',
    },
  };
  var chartLine = new ApexCharts(
    document.querySelector('#chart-line'),
    optionChartLine
  );
  chartLine.render();
}
