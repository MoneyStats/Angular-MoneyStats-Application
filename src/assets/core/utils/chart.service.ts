import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dashboard, Wallet } from '../data/class/dashboard.class';
import * as ApexCharts from 'apexcharts';
import { ChartOptions } from '../data/constant/apex.chart';

//declare var ApexCharts: any;

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  environment = environment;
  constructor() {}

  renderChartLine(dashboard: Dashboard): Partial<ChartOptions> {
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
    let chartOptions: Partial<ChartOptions> = {
      series: series,
      chart: {
        type: 'area',
        width: '100%',
        height: 350,
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
      labels: dashboard.statsWalletDays,
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        floating: false,
        fontFamily: 'Helvetica, Arial',
      },
    };
    return chartOptions;
    //chartLine(series, dashboard.statsWalletDays);
  }

  renderChartWallet(): Partial<ChartOptions> {
    let chartExample1: Partial<ChartOptions> = {
      series: [
        {
          data: [
            512, 405, 666, 1090, 1309, 1400, 1500, 700, 1600, 1400, 1600, 2000,
            1100, 501, 3000, 1000, 2000,
          ],
        },
      ],
      chart: {
        type: 'area',
        width: '100%',
        height: 140,
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 2,
      },
      colors: ['#1DCC70'],
      tooltip: {
        enabled: false,
      },
    };
    return chartExample1;
  }
}

// Obsolete
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
