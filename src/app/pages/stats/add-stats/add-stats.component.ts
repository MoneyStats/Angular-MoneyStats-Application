import { Component, OnInit } from '@angular/core';
import {
  Dashboard,
  Stats,
  Wallet,
} from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
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
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.walletsToSave = this.dashboardService.dashboard.wallets;
    this.getTodayAsString();
  }

  validate() {
    let validate = false;
    this.walletsToSave.forEach((w) => {
      if (!w.newBalance) {
        validate = true;
      }
    });
    return validate;
  }
  save() {
    this.saveValidation = false;
    this.getTodayAsString();
  }

  confirm() {
    this.walletsToSave.forEach((wallet) => {
      if (wallet.allTimeHigh < wallet.balance) {
        wallet.allTimeHigh = wallet.balance;
        wallet.allTimeHighDate = new Date(this.dateStats);
      }
      let currentDate = new Date(this.dateStats);
      if (wallet.highPrice < wallet.balance) {
        wallet.highPrice = wallet.balance;
        wallet.highPriceDate = currentDate;
      }
      if (wallet.highPriceDate.getFullYear() != currentDate.getFullYear()) {
        wallet.highPrice = wallet.balance;
        wallet.highPriceDate = currentDate;
      }
      if (wallet.lowPrice < wallet.balance) {
        wallet.lowPrice = wallet.balance;
        wallet.lowPriceDate = currentDate;
      }
      if (wallet.lowPriceDate.getFullYear() != currentDate.getFullYear()) {
        wallet.lowPrice = wallet.balance;
        wallet.lowPriceDate = currentDate;
      }
      let percentage = (
        ((wallet.newBalance - wallet.balance) / wallet.balance) *
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
