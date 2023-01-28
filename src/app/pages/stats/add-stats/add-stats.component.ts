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
    this.walletsToSave.forEach((wallet) => {
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
      let fixedBalance = wallet.balance != 0 ? wallet.balance : 0.0001;
      let percentage = (
        ((wallet.newBalance - fixedBalance) / fixedBalance) *
        100
      ).toFixed(2);
      wallet.performanceLastStats = parseFloat(percentage);
      wallet.differenceLastStats = wallet.newBalance - wallet.balance;
      wallet.dateLastStats = new Date(this.dateStats);
      wallet.balance = wallet.newBalance;
      wallet.newBalance = parseFloat('');

      let stats: Stats = new Stats();
      stats.balance = wallet.balance;
      stats.date = wallet.dateLastStats.toISOString();
      stats.percentage = wallet.performanceLastStats;
      stats.trend = wallet.differenceLastStats;

      wallet.history = [stats];
    });
    this.saveValidation = true;
  }

  getTodayAsString() {
    let today = new Date().toISOString().split('T')[0];
    this.dateStats = today;
  }
}
