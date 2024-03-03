import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { ErrorService } from 'src/assets/core/interceptors/error.service';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { StatsService } from 'src/assets/core/services/api/stats.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-stats',
  templateUrl: './add-stats.component.html',
  styleUrls: ['./add-stats.component.scss'],
})
export class AddStatsComponent implements OnInit, OnDestroy {
  addStatsSubscribe: Subscription = new Subscription();

  environment = environment;
  saveValidation: boolean = false;
  // Used for warning date
  dateValidation: boolean = false;
  dateStats: string = '';

  walletsToSave: Wallet[] = [];
  coinSymbol?: string;

  constructor(
    public screenService: ScreenService,
    private dashboardService: DashboardService,
    private statsService: StatsService,
    private errorService: ErrorService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.addStatsSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    ScreenService.setupHeader();
    ScreenService.hideFooter();
    if (this.dashboardService.dashboard.wallets) {
      this.walletsToSave = this.dashboardService.dashboard.wallets.filter(
        (w) => !w.deletedDate
      );
    }
    this.coinSymbol = this.dashboardService.coinSymbol;
    this.getTodayAsString();
  }

  screenWidth() {
    return ScreenService.screenWidth;
  }

  validate() {
    this.dateValidation = false;
    let validate = false;
    if (this.walletsToSave) {
      this.walletsToSave.forEach((w) => {
        if (w.newBalance === 0) {
          validate = false;
        } else if (!w.newBalance) {
          validate = true;
        }
      });
    }
    let statsWalletDays = this.dashboardService.dashboard.statsWalletDays;
    if (statsWalletDays && statsWalletDays.find((d) => d === this.dateStats)) {
      this.dateValidation = true;
      validate = true;
    }
    // Previene inserimento di un anno non in dashboard wallet
    // TODO: Implementare call a DB
    if (
      statsWalletDays &&
      statsWalletDays.length &&
      parseInt(statsWalletDays[0].split('-')[0]) >
        parseInt(this.dateStats.split('-')[0])
    ) {
      this.dateValidation = true;
      validate = true;
    }
    return validate;
  }

  save() {
    this.saveValidation = false;
    this.addStatsSubscribe = this.statsService
      .addStatsData(this.walletsToSave)
      .subscribe((data) => {
        LOG.info(data.message!, 'AddStatsComponent');
        this.walletsToSave = data.data;
        SwalService.toastMessage(
          SwalIcon.SUCCESS,
          this.translate.instant('response.stats')
        );
      });
    this.getTodayAsString();
  }

  confirm() {
    let statsWalletDays = this.dashboardService.dashboard.statsWalletDays;
    if (!statsWalletDays) statsWalletDays = [];

    this.walletsToSave.forEach((wallet) => {
      wallet = this.setWalletHighAndLow(wallet);
      // Check Wallet Date if is before the current date to prevert the update of the data

      let stats: Stats = new Stats();
      this.setDataForNewStats(wallet, statsWalletDays, stats);

      wallet.newBalance = parseFloat('');
    });
    if (!this.dashboardService.dashboard.statsWalletDays)
      this.dashboardService.dashboard.statsWalletDays = [];
    this.dashboardService.dashboard.statsWalletDays.push(this.dateStats);
    this.dashboardService.dashboard.statsWalletDays.sort();
    this.saveValidation = true;
  }

  setDataForNewStats(wallet: Wallet, statsWalletDays: string[], stats: Stats) {
    /* trovo gli indici corrispondenti da analizzare inserendo la data corrente
     * all'interno della lista di date e trovo l'indice della mia data
     */
    const days: any = [];

    statsWalletDays.forEach((d) => {
      days.push(d);
    });

    days.push(this.dateStats);
    days.sort();
    let indexDate = days.indexOf(this.dateStats);
    // Mi servono gli stats subito prima e subito dopo da analizzare
    let afterThisStats: Stats = new Stats();
    let beforeThisStats: Stats = new Stats();
    beforeThisStats.balance = 0.001;
    // Check se si hanno stats dopo quello che stiamo inserendo
    if (days[indexDate + 1]) {
      if (
        afterThisStats == undefined ||
        wallet.history.find((w) => w.date == undefined)!
      ) {
        this.errorService.handleWalletStatsError();
        this.router.navigate(['error']);
      }

      afterThisStats = wallet.history.find(
        (w) => w.date.toString() === days[indexDate + 1]
      )!;

      // Modifico i dati delle percentuali e trend
      let percentageAfterThisStats = Utils.roundToTwoDecimalPlaces(
        ((afterThisStats.balance -
          (wallet.newBalance != 0 ? wallet.newBalance : 0.001)) /
          (wallet.newBalance != 0 ? wallet.newBalance : 0.001)) *
          100
      );
      afterThisStats.percentage =
        percentageAfterThisStats > 10000 ? 1000 : percentageAfterThisStats;
      afterThisStats.trend = Utils.roundToTwoDecimalPlaces(
        afterThisStats.balance - wallet.newBalance
      );
    }
    if (days[indexDate - 1]) {
      beforeThisStats = wallet.history
        ? wallet.history.find(
            (w) =>
              w.date != undefined && w.date.toString() === days[indexDate - 1]
          )!
        : undefined!;
      if (beforeThisStats == undefined) {
        beforeThisStats = new Stats();
        beforeThisStats.balance = 0.001;
      }
    }
    let percentageThisStats = Utils.roundToTwoDecimalPlaces(
      ((wallet.newBalance - beforeThisStats.balance) /
        beforeThisStats.balance) *
        100
    );

    stats.balance = wallet.newBalance;
    stats.date = new Date(this.dateStats);
    stats.percentage = percentageThisStats > 10000 ? 1000 : percentageThisStats;
    stats.trend = Utils.roundToTwoDecimalPlaces(
      stats.balance -
        (beforeThisStats.balance != 0.001 ? beforeThisStats.balance : 0)
    );

    // Ultimo
    if (!afterThisStats.balance) {
      if (!beforeThisStats.date) {
        stats.percentage = 0;
      }

      wallet.performanceLastStats = stats.percentage;
      wallet.differenceLastStats = stats.trend;

      wallet.dateLastStats = stats.date;
      wallet.balance = stats.balance;

      wallet.history = [stats];
    } else if (afterThisStats.balance && indexDate === days.length - 2) {
      wallet.differenceLastStats = afterThisStats.trend;
      wallet.performanceLastStats = afterThisStats.percentage;
      wallet.history = [afterThisStats, stats];
    } else {
      wallet.history = [afterThisStats, stats];
    }
  }

  getTodayAsString() {
    let today = new Date().toISOString().split('T')[0];
    this.dateStats = today;
  }

  setWalletHighAndLow(wallet: Wallet): Wallet {
    if (wallet.allTimeHigh < wallet.newBalance) {
      wallet.allTimeHigh = wallet.newBalance;
      wallet.allTimeHighDate = new Date(this.dateStats);
    }
    let currentDate = new Date(this.dateStats);
    if (wallet.highPrice < wallet.newBalance) {
      wallet.highPrice = wallet.newBalance;
      wallet.highPriceDate = currentDate;
    }
    if (wallet.highPriceDate) {
      if (
        new Date(wallet.highPriceDate).getFullYear() !=
        currentDate.getFullYear()
      ) {
        wallet.highPrice = wallet.newBalance;
        wallet.highPriceDate = currentDate;
      }
    }
    if (wallet.lowPrice === 0 || wallet.lowPrice > wallet.newBalance) {
      wallet.lowPrice = wallet.newBalance;
      wallet.lowPriceDate = currentDate;
    }
    if (
      new Date(wallet.lowPriceDate).getFullYear() != currentDate.getFullYear()
    ) {
      wallet.lowPrice = wallet.newBalance;
      wallet.lowPriceDate = currentDate;
    }
    return wallet;
  }
}
