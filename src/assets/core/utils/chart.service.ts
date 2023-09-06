import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dashboard, Stats, Wallet } from '../data/class/dashboard.class';
import * as ApexCharts from 'apexcharts';
import { ApexOptions } from '../data/constant/apex.chart';
import { CryptoDashboard } from '../data/class/crypto.class';
import { ImageColorPickerService } from './image.color.picker.service';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private colorsList: string[] = [
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
  ];
  environment = environment;
  constructor(private imageColorPicker: ImageColorPickerService) {}

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
    dashboard.statsWalletDays = filterDate;**/
    dashboard.wallets.forEach((wallet) => {
      let oldBalance =
        wallet.differenceLastStats != 0
          ? wallet.balance - wallet.differenceLastStats
          : 0;
      let historyBalance: Array<number> = [];
      let index = 0;
      if (wallet.history) {
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
      }
      historyBalance = [];
    });
    let finalStatsDays: string[] = [];
    dashboard.statsWalletDays.forEach((d) =>
      finalStatsDays.push(new Date(d).toDateString())
    );
    let chartOptions: Partial<ApexOptions> = {
      series: series,
      chart: {
        type: 'area',
        width: '100%',
        height: 380,
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
      labels: finalStatsDays,
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
    let finalStatsDays: string[] = [];
    historyDates.forEach((d) =>
      finalStatsDays.push(new Date(d).toDateString())
    );
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

  renderCryptoAsset1(
    cryptoDashboard: CryptoDashboard,
    ...height: number[]
  ): Partial<ApexOptions> {
    let series: Array<any> = [];
    let oldStats: any = new Stats();
    let statsAssetsDays = cryptoDashboard.statsAssetsDays
      ? cryptoDashboard.statsAssetsDays.slice()
      : cryptoDashboard.statsAssetsDays;
    let oldDate: any =
      statsAssetsDays && statsAssetsDays.length != 0
        ? parseInt(statsAssetsDays[statsAssetsDays.length - 1].split('-')[0]) -
          1
        : undefined;
    let colors: string[] = [];
    cryptoDashboard.assets.forEach((asset, index1) => {
      colors.push(this.imageColorPicker.getColor(asset.icon!, index1));
      let oldBalance = 0;
      let historyBalance: Array<number> = [];
      let index = 0;

      if (statsAssetsDays && statsAssetsDays.length === 1) {
        statsAssetsDays.splice(0, 0, oldDate.toString());
      }
      if (asset && asset.history && asset.history.length != 0) {
        if (asset.history.length === 1) {
          oldStats.balance = oldBalance;
          oldStats.date = oldDate;
          asset.history!.splice(0, 0, oldStats);
        }
        asset.history!.forEach((h) => {
          if (h.date == undefined) {
            return;
          }
          let count = statsAssetsDays.indexOf(h.date.toString());
          if (count != -1 && count != index) {
            Array.from(Array(count - index)).forEach((d) =>
              historyBalance.push(0)
            );
            index = count;
          }
          historyBalance.push(h.balance);
          index++;
        });

        // Aggiungo l'ultimo valore dell'asset corrente se l'ultimo stats non corrisponde ad oggi
        let today = new Date();
        const lastDay: Date = new Date(
          statsAssetsDays[statsAssetsDays.length - 1]
        );
        if (lastDay < today) {
          //if (lastDay.getDate() < today.getDate()) {
          historyBalance.push(asset.value!);
          statsAssetsDays.push(today.toDateString());
        }
      } else {
        // Se dovessi avere più Asset con uno di essi con history mentre l'altro no lo si gestisce così
        if (statsAssetsDays && statsAssetsDays.length != 0) {
          let today = new Date();
          let lastDay;
          // (Caso solo per asset singoli) Se dovessi avere un asset appena aggiunto (Senza History) ma durante l'anno ho degli stats, devo prendere l'ultima data registrata e settarla a 0
          if (
            cryptoDashboard.assets.length == 1 &&
            statsAssetsDays.length > 1 &&
            !asset.history
          ) {
            statsAssetsDays = [statsAssetsDays[statsAssetsDays.length - 1]];
            historyBalance.push(0);

            lastDay = statsAssetsDays[statsAssetsDays.length - 1];
            statsAssetsDays.push(today.toDateString());
          } else {
            // (Caso si abbiamo più di un asset)
            // L'index è -2 perchè essendo più asset ma questo non ha history è stato aggiunto il valore last
            lastDay = statsAssetsDays[statsAssetsDays.length - 2];
          }
          let count = statsAssetsDays.indexOf(lastDay);
          if (count != -1 && count != index) {
            Array.from(Array(count - index)).forEach((d) =>
              historyBalance.push(0)
            );
            // Pusho per l'ultima data valida trovata
            historyBalance.push(0);
          }

          if (new Date(lastDay) < today) {
            historyBalance.push(asset.value!);
          }
        } else {
          historyBalance.push(0);
          historyBalance.push(asset.value!);
          let today = new Date();
          let yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          statsAssetsDays = [yesterday.toDateString()];
          statsAssetsDays.push(today.toDateString());
        }
      }
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
      colors: colors.length != 0 ? colors : this.colorsList,
      labels: statsAssetsDays,
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

  renderCryptoAsset(
    cryptoDashboard: CryptoDashboard,
    ...optional: any[]
  ): Partial<ApexOptions> {
    let series: Array<any> = [];
    let statsAssetsDays = cryptoDashboard.statsAssetsDays
      ? cryptoDashboard.statsAssetsDays.slice()
      : cryptoDashboard.statsAssetsDays;
    let returnStatsDays: string[] =
      statsAssetsDays != undefined ? statsAssetsDays.slice() : [];
    let colors: string[] = [];
    cryptoDashboard.assets.forEach((asset, index1) => {
      colors.push(this.imageColorPicker.getColor(asset.icon!, index1));
      let historyBalance: Array<number> = [];
      let index = 0;
      console.log(returnStatsDays);

      if (asset && asset.history && asset.history.length != 0) {
        asset.history!.forEach((h) => {
          if (h.date == undefined) {
            return;
          }
          let count = returnStatsDays.indexOf(h.date.toString());
          if (count != -1 && count != index) {
            Array.from(Array(count - index)).forEach((d) =>
              historyBalance.push(0)
            );
            index = count;
          }
          historyBalance.push(h.balance);
          index++;
        });

        // Aggiungo l'ultimo valore dell'asset corrente se l'ultimo stats non corrisponde ad oggi
        let today = new Date();
        const lastDay: Date = new Date(
          returnStatsDays[returnStatsDays.length - 1]
        );
        if (lastDay < today && optional[1]) {
          //if (lastDay.getDate() < today.getDate()) {
          historyBalance.push(asset.value!);
          returnStatsDays.push(today.toDateString());
        }
      } else {
        // Se dovessi avere più Asset con uno di essi con history mentre l'altro no lo si gestisce così
        if (statsAssetsDays && statsAssetsDays.length != 0) {
          let today = new Date();
          let lastDay;
          // (Caso solo per asset singoli) Se dovessi avere un asset appena aggiunto (Senza History) ma durante l'anno ho degli stats, devo prendere l'ultima data registrata e settarla a 0
          //if (cryptoDashboard.assets.length == 1 && !asset.history) {
          returnStatsDays = [statsAssetsDays[statsAssetsDays.length - 1]];
          historyBalance.push(0);

          lastDay = statsAssetsDays[statsAssetsDays.length - 1];
          returnStatsDays.push(today.toDateString());
          //} else {
          //  // (Caso si abbiamo più di un asset)
          //  // L'index è -2 perchè essendo più asset ma questo non ha history è stato aggiunto il valore last
          //  lastDay = statsAssetsDays[statsAssetsDays.length - 2];
          //  historyBalance.push(0);
          //}

          let count = returnStatsDays.indexOf(lastDay);
          if (count != -1 && count != index) {
            Array.from(Array(count - index)).forEach((d) =>
              historyBalance.push(0)
            );
            // Pusho per l'ultima data valida trovata
            historyBalance.push(0);
          }

          if (new Date(lastDay) < today) {
            historyBalance.push(asset.value!);
          }
          console.log(statsAssetsDays);
        } else {
          console.log('ZRO');
          historyBalance.push(0);
          historyBalance.push(asset.value!);
          let today = new Date();
          let yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          returnStatsDays = [yesterday.toDateString()];
          returnStatsDays.push(today.toDateString());
          console.log(returnStatsDays);
        }
      }
      console.log(historyBalance);
      console.log(statsAssetsDays);
      let serie = {
        name: asset.name,
        data: historyBalance,
      };
      series.push(serie);
      historyBalance = [];
    });
    let h = 350;
    if (optional[0] && optional[0] != undefined) {
      h = optional[0];
    }
    let finalStatsDays: string[] = [];
    if (returnStatsDays.length != 0)
      returnStatsDays.forEach((d) =>
        finalStatsDays.push(new Date(d).toDateString())
      );
    else
      statsAssetsDays.forEach((d) =>
        finalStatsDays.push(new Date(d).toDateString())
      );
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
      colors: colors.length != 0 ? colors : this.colorsList,
      labels: finalStatsDays,
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
