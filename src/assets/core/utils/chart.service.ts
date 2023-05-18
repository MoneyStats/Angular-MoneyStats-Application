import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dashboard, Stats, Wallet } from '../data/class/dashboard.class';
import * as ApexCharts from 'apexcharts';
import { ApexOptions } from '../data/constant/apex.chart';
import { CryptoDashboard } from '../data/class/crypto.class';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  environment = environment;
  constructor() {}

  renderChartLine(dashboard: Dashboard): Partial<ApexOptions> {
    let series: Array<any> = [];
    let oldStats: any = new Stats();
    let oldDate: any;
    if (dashboard.statsWalletDays.length === 1) {
      oldDate =
        parseInt(
          dashboard.statsWalletDays[dashboard.statsWalletDays.length - 1].split(
            '-'
          )[0]
        ) - 1;
      dashboard.statsWalletDays.splice(0, 0, oldDate.toString());
    }
    /**let filterDate: string[] = [];
    dashboard.statsWalletDays.forEach((d, index) => {
      if (d.split('-')[1]) {
        filterDate.push(d);
      }
    });
    console.log(filterDate, dashboard);
    dashboard.statsWalletDays = filterDate;**/
    dashboard.wallets.forEach((wallet) => {
      let oldBalance =
        wallet.differenceLastStats != 0
          ? wallet.balance - wallet.differenceLastStats
          : 0;
      let historyBalance: Array<number> = [];
      let index = 0;
      if (wallet.history.length === 1) {
        oldStats.balance = oldBalance;

        oldStats.date = oldDate;
        wallet.history.splice(0, 0, oldStats);
      }
      wallet.history.forEach((h) => {
        if (h.date == undefined) {
          return;
        }
        let count = dashboard.statsWalletDays.indexOf(h.date.toString());
        if (count != index) {
          Array.from(Array(count - index)).forEach((d) =>
            historyBalance.push(0)
          );
          index = count;
        }
        historyBalance.push(h.balance);
        index++;
      });
      let serie = {
        name: wallet.name,
        data: historyBalance,
      };
      series.push(serie);
      historyBalance = [];
    });
    let chartOptions: Partial<ApexOptions> = {
      series: series,
      chart: {
        type: 'area',
        width: '100%',
        height: 350,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
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

  renderChartLineCategory(totalMap: Map<string, any>): Partial<ApexOptions> {
    let labels: Array<string> = [];
    let series: Array<any> = [];
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
      let serie = {
        name: key,
        data: historyBalance,
      };
      series.push(serie);
      historyBalance = [];

      index++;
    });

    let chartOptions: Partial<ApexOptions> = {
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
      labels: labels,
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

  renderChartWallet(name: string, stats: Stats[]): Partial<ApexOptions> {
    let series: Array<any> = [];
    let historyBalance: Array<number> = [];
    let historyDates: Array<string> = [];
    let oldStats: any = new Stats();
    if (stats.length === 1) {
      oldStats.balance =
        stats[0].trend != 0 ? stats[0].balance - stats[0].trend : 0;
      oldStats.date = parseInt(stats[0].date.toString().split('-')[0]) - 1;
      stats.splice(0, 0, oldStats);
    }
    stats.forEach((s) => {
      historyBalance.push(s.balance);

      historyDates.push(s.date.toString());
    });
    let serie = {
      name: name,
      data: historyBalance,
    };
    series.push(serie);
    historyBalance = [];
    let chartExample1: Partial<ApexOptions> = {
      series: series,
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
      labels: historyDates,
    };
    return chartExample1;
  }

  renderChartPie(wallets: Wallet[]): Partial<ApexOptions> {
    let series: Array<any> = [];
    let walletName: Array<string> = [];
    wallets.forEach((wallet) => {
      walletName.push(wallet.name);
      series.push(wallet.balance);
      //let historyBalance: Array<number> = [];
      /*wallet.history.forEach((h) => {
        historyBalance.push(h.balance);
      });*/
      /*let serie = {
        name: wallet.name,
        data: historyBalance,
      };*/
      //series.push(serie);
    });
    let chartExample1: Partial<ApexOptions> = {
      series: series,
      chart: {
        width: '100%',
        height: 345,
        type: 'pie',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'right',
            },
          },
        },
      ],
      labels: walletName,
    };
    series = [];
    return chartExample1;
  }
  renderChartBar(dates: string[], balances: number[]): Partial<ApexOptions> {
    let series: Array<any> = [];
    let walletName: Array<string> = dates;
    let serie = [
      {
        data: balances,
      },
    ];
    let chartExample1: Partial<ApexOptions> = {
      series: serie,
      chart: {
        width: '100%',
        height: 400,
        type: 'bar',
      },
      stroke: {
        width: 2,
      },
      colors: ['#6236FF'],
      labels: walletName,
    };
    series = [];
    return chartExample1;
  }

  renderCryptoAsset(
    cryptoDashboard: CryptoDashboard,
    ...height: number[]
  ): Partial<ApexOptions> {
    let series: Array<any> = [];
    let oldStats: any = new Stats();
    let oldDate: any;
    if (cryptoDashboard.statsAssetsDays.length === 1) {
      oldDate =
        parseInt(
          cryptoDashboard.statsAssetsDays[
            cryptoDashboard.statsAssetsDays.length - 1
          ].split('-')[0]
        ) - 1;
      cryptoDashboard.statsAssetsDays.splice(0, 0, oldDate.toString());
    }
    cryptoDashboard.assets.forEach((asset) => {
      let oldBalance = 0;
      let historyBalance: Array<number> = [];
      let index = 0;
      if (asset.history!.length === 1) {
        oldStats.balance = oldBalance;

        oldStats.date = oldDate;
        asset.history!.splice(0, 0, oldStats);
      }
      asset.history!.forEach((h) => {
        if (h.date == undefined) {
          return;
        }
        let count = cryptoDashboard.statsAssetsDays.indexOf(h.date.toString());
        if (count != index) {
          Array.from(Array(count - index)).forEach((d) =>
            historyBalance.push(0)
          );
          index = count;
        }
        historyBalance.push(h.balance);
        index++;
      });
      let serie = {
        name: asset.name,
        data: historyBalance,
      };
      series.push(serie);
      historyBalance = [];
    });
    let h = 350;
    if (height[0]) {
      h = height[0];
    }

    let chartOptions: Partial<ApexOptions> = {
      series: series,
      chart: {
        type: 'area',
        width: '100%',
        height: h,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
        background: {
          borderRadius: 20,
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
      labels: cryptoDashboard.statsAssetsDays,
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
}
