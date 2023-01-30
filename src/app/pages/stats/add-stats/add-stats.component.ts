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
    this.walletsToSave = this.dashboardService.dashboard.wallets.filter(
      (w) => !w.deletedDate
    );
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
      console.log(data);
    });
    this.getTodayAsString();
  }

  confirm() {
    let statsWalletDays = this.dashboardService.dashboard.statsWalletDays;

    this.walletsToSave.forEach((wallet) => {
      console.log(wallet);
      wallet = this.setWalletHighAndLow(wallet);
      // Check Wallet Date if is before the current date to prevert the update of the data

      let stats: Stats = new Stats();
      // Se data non presente o nuova data
      if (
        new Date(statsWalletDays[statsWalletDays.length - 1]) <
          new Date(this.dateStats) ||
        !statsWalletDays.length
      ) {
        let fixedBalance = wallet.balance != 0 ? wallet.balance : 0.0001;
        let percentage = (
          ((wallet.newBalance - fixedBalance) / fixedBalance) *
          100
        ).toFixed(2);
        wallet.performanceLastStats = parseFloat(percentage);
        wallet.differenceLastStats = wallet.newBalance - wallet.balance;

        wallet.dateLastStats = new Date(this.dateStats);
        wallet.balance = wallet.newBalance;

        stats.balance = wallet.balance;
        stats.date = new Date(this.dateStats);
        stats.percentage = wallet.performanceLastStats;
        stats.trend = wallet.differenceLastStats;
        wallet.history = [stats];
        // Se data compresa tra ultimo e penultimo stats
      } else if (
        new Date(statsWalletDays[statsWalletDays.length - 1]) &&
        new Date(statsWalletDays[statsWalletDays.length - 2]) &&
        new Date(this.dateStats) <
          new Date(statsWalletDays[statsWalletDays.length - 1]) &&
        new Date(this.dateStats) >
          new Date(statsWalletDays[statsWalletDays.length - 2])
      ) {
        let statsToUpdate: any = wallet.history.find(
          (w) =>
            w.date.toString() === statsWalletDays[statsWalletDays.length - 1]
        );
        let fixedBalance = wallet.balance != 0 ? wallet.balance : 0.0001;
        let percentage = (
          ((fixedBalance - wallet.newBalance) / wallet.newBalance) *
          100
        ).toFixed(2);

        statsToUpdate.percentage = parseFloat(percentage);
        statsToUpdate.trend = wallet.balance - wallet.newBalance;

        let oldStats: any = wallet.history.find(
          (w) =>
            w.date.toString() === statsWalletDays[statsWalletDays.length - 2]
        );

        let percentageOld = (
          ((wallet.newBalance - oldStats.balance) / oldStats.balance) *
          100
        ).toFixed(2);

        wallet.performanceLastStats = statsToUpdate.percentage;
        wallet.differenceLastStats = statsToUpdate.trend;

        stats.balance = wallet.newBalance;
        stats.date = new Date(this.dateStats);
        stats.percentage = parseFloat(percentageOld);
        stats.trend = wallet.newBalance - oldStats.balance;

        wallet.history = [statsToUpdate, stats];
      } else if (
        new Date(statsWalletDays[statsWalletDays.length - 1]) &&
        new Date(this.dateStats) <
          new Date(statsWalletDays[statsWalletDays.length - 1])
      ) {
        // trovo gli indici corrispondenti da analizzare
        statsWalletDays.push(this.dateStats);
        statsWalletDays.sort();
        let indexDate = statsWalletDays.indexOf(this.dateStats);
        // Mi servono gli stats subito prima e subito dopo da analizzare e modificare quello subito dopo
        let newStats: any = wallet.history.find(
          (w) => w.date.toString() === statsWalletDays[indexDate + 1]
        );
        let oldStats: any;
        if (indexDate === 0) {
          oldStats = new Stats();
          oldStats.balance = 0.001;
        } else {
          oldStats = wallet.history.find(
            (w) => w.date.toString() === statsWalletDays[indexDate - 1]
          );
        }

        console.log(oldStats, indexDate, statsWalletDays);
        let percentage = (
          ((newStats.balance - wallet.newBalance) / wallet.newBalance) *
          100
        ).toFixed(2);

        let percentageOld = (
          ((wallet.newBalance - oldStats.balance) / oldStats.balance) *
          100
        ).toFixed(2);

        stats.balance = wallet.newBalance;
        stats.date = new Date(this.dateStats);
        stats.percentage = parseFloat(percentageOld);
        stats.trend = wallet.newBalance - oldStats.balance;

        newStats.percentage = parseFloat(percentage);
        newStats.trend = newStats.balance - wallet.newBalance;

        wallet.history = [newStats, stats];
      }

      wallet.newBalance = parseFloat('');
    });
    this.saveValidation = true;
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
      wallet.lowPrice = wallet.balance;
      wallet.lowPriceDate = currentDate;
    }
    return wallet;
  }
}
