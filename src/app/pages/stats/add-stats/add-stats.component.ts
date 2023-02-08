import { Component, OnInit } from '@angular/core';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { StatsService } from 'src/assets/core/services/stats.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-add-stats',
  templateUrl: './add-stats.component.html',
  styleUrls: ['./add-stats.component.scss'],
})
export class AddStatsComponent implements OnInit {
  saveValidation: boolean = false;
  // Used for warning date
  dateValidation: boolean = false;
  dateStats: string = '';

  walletsToSave: Wallet[] = [];

  constructor(
    public screenService: ScreenService,
    private dashboardService: DashboardService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.hideFooter();
    if (this.dashboardService.dashboard.wallets) {
      this.walletsToSave = this.dashboardService.dashboard.wallets.filter(
        (w) => !w.deletedDate
      );
    }
    this.getTodayAsString();
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
    if (statsWalletDays.find((d) => d === this.dateStats)) {
      this.dateValidation = true;
      validate = true;
    }
    // Previene inserimento di un anno non in dashboard wallet
    // TODO: Implementare call a DB
    if (
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
    this.statsService.addStats(this.walletsToSave).subscribe((data) => {
      this.walletsToSave = data.data;
    });
    this.getTodayAsString();
  }

  confirm() {
    let statsWalletDays = this.dashboardService.dashboard.statsWalletDays;

    this.walletsToSave.forEach((wallet) => {
      wallet = this.setWalletHighAndLow(wallet);
      // Check Wallet Date if is before the current date to prevert the update of the data

      let stats: Stats = new Stats();
      this.setDataForNewStats(wallet, statsWalletDays, stats);

      wallet.newBalance = parseFloat('');
    });
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
      afterThisStats = wallet.history.find(
        (w) => w.date.toString() === days[indexDate + 1]
      )!;

      // Modifico i dati delle percentuali e trend
      let percentageAfterThisStats = (
        ((afterThisStats.balance -
          (wallet.newBalance != 0 ? wallet.newBalance : 0.001)) /
          (wallet.newBalance != 0 ? wallet.newBalance : 0.001)) *
        100
      ).toFixed(2);
      afterThisStats.percentage = parseFloat(percentageAfterThisStats);
      afterThisStats.trend = parseFloat(
        (afterThisStats.balance - wallet.newBalance).toFixed(2)
      );
    }
    if (days[indexDate - 1]) {
      beforeThisStats = wallet.history.find(
        (w) => w.date.toString() === days[indexDate - 1]
      )!;
    }
    let percentageThisStats = (
      ((wallet.newBalance - beforeThisStats.balance) /
        beforeThisStats.balance) *
      100
    ).toFixed(2);

    stats.balance = wallet.newBalance;
    stats.date = new Date(this.dateStats);
    stats.percentage = parseFloat(percentageThisStats);
    stats.trend = parseFloat(
      (
        stats.balance -
        (beforeThisStats.balance != 0.001 ? beforeThisStats.balance : 0)
      ).toFixed(2)
    );

    if (!afterThisStats.balance) {
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
