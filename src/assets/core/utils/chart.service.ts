import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dashboard, Stats, Wallet } from '../data/class/dashboard.class';
import { ApexOptions } from '../data/constant/apex.chart';
import { CryptoDashboard, Operation } from '../data/class/crypto.class';
import { ImageColorPickerService } from './image.color.picker.service';
import { Utils } from '../services/config/utils.service';
import { ScreenService } from './screen.service';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private static BACKGROUND: Array<string> = [
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
  private static colorsList: string[] = [
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

  public static appRenderWalletPerformance(
    dashboard: Dashboard
  ): Partial<ApexOptions> {
    let series: Array<any> = [];
    let oldStats: any = new Stats();
    let oldDate: any;
    let colors: string[] = [];

    if (dashboard.statsWalletDays.length === 1) {
      oldDate =
        parseInt(
          dashboard.statsWalletDays[dashboard.statsWalletDays.length - 1].split(
            '-'
          )[0]
        ) - 1;
      dashboard.statsWalletDays.splice(0, 0, oldDate.toString());
    }
    dashboard.wallets.forEach((wallet, indexWallet) => {
      colors.push(ImageColorPickerService.getColor(wallet.img!, indexWallet));
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
          historyBalance.push(Utils.roundToTwoDecimalPlaces(h.balance));
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
    dashboard.statsWalletDays.forEach(
      (d) =>
        finalStatsDays.push(
          Utils.formatDateIntl(new Date(d).toLocaleDateString())
        )
      /** Mostra le date come Wed 01 Nov 2024*/
      //finalStatsDays.push(new Date(d).toDateString())
    );
    return this.createChartLine(
      colors,
      series,
      finalStatsDays,
      380,
      ScreenService.isMobileDevice()
    );
  }

  public static renderChartLineCategory(
    totalMap: Map<string, any>
  ): Partial<ApexOptions> {
    let labels: Array<string> = [];
    let series: Array<any> = [];
    let index = 0;
    totalMap.forEach((value: any, key: string) => {
      let historyBalance: Array<number> = [];

      value.forEach((v: any) => {
        historyBalance.push(v.balance);
        if (index === 0) {
          if (v.date.length === 4) labels.push(v.date);
          else
            labels.push(
              Utils.formatDateIntl(new Date(v.date).toLocaleDateString())
            );
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

    return this.createChartLine(
      [],
      series,
      labels,
      '400',
      ScreenService.isMobileDevice() ?? false
    );
  }

  public static renderChartWallet(
    name: string,
    stats: Stats[]
  ): Partial<ApexOptions> {
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
        theme: 'dark',
      },
      labels: historyDates,
    };
    return chartExample1;
  }

  public static appRenderChartPie(wallets: Wallet[]): Partial<ApexOptions> {
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
  public static appRenderChartBar(
    dates: string[],
    currency: string,
    balances: number[]
  ): Partial<ApexOptions> {
    let series: Array<any> = [];
    let walletName: Array<string> = dates;
    let serie = [
      {
        name: 'Total ' + currency,
        data: balances,
      },
    ];
    let chartExample1: Partial<ApexOptions> = {
      series: serie,
      chart: {
        width: '100%',
        height: 400,
        type: 'bar',
        sparkline: {
          enabled: ScreenService.isMobileDevice(),
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 20,
          borderRadiusApplication: 'end',
          horizontal: false,
        },
      },
      grid: {
        show: false,
        borderColor: '#555',
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      tooltip: {
        theme: 'dark',
      },
      colors: ['#6236FF'],
      labels: walletName,
    };
    series = [];
    return chartExample1;
  }

  public static renderCryptoDatas(
    cryptoDashboard: CryptoDashboard,
    isMobileDevice: boolean = true,
    /**
     * 1.Parametro: Dimensione Grafico
     * 2.Parametro: Boolean Siamo in Resume (Setta il live price come ultimo dato)
     */
    ...optional: any[]
  ): Partial<ApexOptions> {
    let series: Array<any> = [];
    let statsAssetsDays = cryptoDashboard.statsAssetsDays.slice();
    let colors: string[] = [];

    let options: Array<any> = optional[0];
    let today = new Date();
    cryptoDashboard.assets.forEach((asset, indexAsset) => {
      colors.push(ImageColorPickerService.getColor(asset.icon!, indexAsset));
      let historyBalance: Array<number> = [];
      if (statsAssetsDays == undefined || statsAssetsDays.length == 0) {
        historyBalance.push(0);
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        statsAssetsDays = [yesterday.toDateString()];
      } else
        statsAssetsDays.forEach((day) => {
          if (asset.history && asset.history.length > 0) {
            let history = asset.history.find((h) => h.date.toString() == day);
            if (history) {
              return historyBalance.push(
                Utils.roundToTwoDecimalPlaces(history?.balance!)
              );
            }
          }
          return historyBalance.push(0);
        });

      // Se non è in resume setto l'ultimo giorno
      if (options != undefined && options[1] != undefined && !options[1]) {
        // Aggiungo l'ultimo valore dell'asset corrente se l'ultimo stats non corrisponde ad oggi
        const lastDay: Date = new Date(
          statsAssetsDays[statsAssetsDays.length - 1]
        );
        if (lastDay < today) {
          historyBalance.push(Utils.roundToTwoDecimalPlaces(asset.value!));
        }
      }

      let serie = {
        name: asset.name,
        data: historyBalance,
      };
      series.push(serie);
    });

    /**
     * Se non è in resume setto l'ultimo giorno
     * Utilizzata per inserire l'ultima data
     */
    if (options != undefined && options[1] != undefined && !options[1]) {
      // Aggiungo l'ultimo valore dell'asset corrente se l'ultimo stats non corrisponde ad oggi
      const lastDay: Date = new Date(
        statsAssetsDays[statsAssetsDays.length - 1]
      );
      if (lastDay < today) {
        statsAssetsDays.push(today.toDateString());
      }
    }
    let h = 350;
    if (options != undefined && options[0] != undefined && options[0]) {
      h = options[0];
    }
    let finalStatsDays: string[] = [];
    statsAssetsDays.forEach((d) => {
      finalStatsDays.push(
        new Date(d).toDateString() == 'Invalid Date'
          ? d
          : new Date(d).toDateString()
      );
    });
    return this.createChartLine(
      colors,
      series,
      finalStatsDays,
      h,
      isMobileDevice
    );
  }

  public static renderTradingOperations(
    operations: Array<Operation>,
    optional: any[]
  ): Partial<ApexOptions> {
    let operationsCopy = Utils.copyObject(operations);
    let tradingDate: Array<string> = [];
    operationsCopy = operationsCopy.sort(
      (b: any, a: any) =>
        new Date(b.exitDate!).getTime() - new Date(a.exitDate!).getTime()
    );
    operationsCopy = operationsCopy.filter((o: any) => o.status == 'CLOSED');

    let wallets: Array<Wallet> = [];

    operationsCopy.forEach((operation: any) => {
      let exitDate = operation.exitDate?.toString().split('T')[0]!;
      if (!tradingDate.find((d) => d == exitDate)) tradingDate.push(exitDate);

      if (!wallets.find((w) => w.id == operation?.wallet!.id))
        wallets.push(operation?.wallet!);
    });

    let totalInvested: number = 0;

    wallets.forEach((wallet) => {
      wallet.assets.forEach((asset) => (totalInvested += asset.invested));
    });

    let investedSum: number = totalInvested;
    let profit: number = 0;
    let investedBalance: Array<number> = [];
    let trendBalance: Array<number> = [];
    let singleBalance: Array<number> = [];
    investedBalance.push(parseFloat(totalInvested.toFixed(2)));
    trendBalance.push(0);
    singleBalance.push(0);

    tradingDate.forEach((date) => {
      let op = operationsCopy.filter(
        (op: any) => op.exitDate?.toString().split('T')[0]! == date
      );
      let singleTrend: number = 0;
      let title: string = '';
      op.forEach((o: any) => {
        investedSum += o.trend!;
        profit += o.trend!;
        singleTrend += o.trend!;
        title += o.entryCoin + '/' + o.exitCoin + '</br>';
      });

      investedBalance.push(parseFloat(investedSum.toFixed(2)));
      trendBalance.push(profit);
      singleBalance.push(singleTrend);
    });
    tradingDate.splice(0, 0, '2023-01-01');

    let serieInvested = {
      name: 'Balance',
      data: investedBalance,
    };

    let trend = {
      name: 'Trend',
      data: trendBalance,
    };

    let singlePerformace = {
      name: 'Operation Performace',
      data: singleBalance,
    };

    let series: Array<any> = [serieInvested, trend, singlePerformace];
    let options: Array<any> = optional[0];

    let h = 350;
    if (options != undefined && options[0] != undefined && options[0]) {
      h = options[0];
    }
    let finalStatsDays: string[] = [];
    tradingDate.forEach((d) => finalStatsDays.push(new Date(d).toDateString()));
    return this.createChartLine(
      ['#6236FF', '#1DCC70', '#FF781F'],
      series,
      finalStatsDays,
      h,
      ScreenService.isMobileDevice()
    );
  }

  /**
   * Chart Line Rendering
   * @param colors
   * @param series
   * @param finalStatsDays
   * @param h
   * @returns
   */
  public static createChartLine(
    colors: string[],
    series: Array<any>,
    finalStatsDays: string[],
    h: any,
    disableOptions: boolean = true
  ) {
    let chartOptions: Partial<ApexOptions> = {
      series: series,
      chart: {
        type: 'area',
        width: '100%',
        height: h,
        sparkline: {
          enabled: disableOptions,
        },
      },
      dataLabels: {
        enabled: false,
        background: {
          borderRadius: 20,
        },
      },
      grid: {
        show: false,
        borderColor: '#555',
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      tooltip: {
        theme: 'dark',
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
  }
}
