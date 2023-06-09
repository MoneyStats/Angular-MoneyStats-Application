import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ErrorService } from 'src/assets/core/interceptors/error.service';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { StatsService } from 'src/assets/core/services/stats.service';

@Component({
  selector: 'app-operations-modal',
  templateUrl: './operations-modal.component.html',
  styleUrls: ['./operations-modal.component.scss'],
})
export class OperationsModalComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('wallets') wallets: Wallet[] = [];
  @Input('assets') assets: Asset[] = [];
  @Input('currency') currency: string = '';
  @Input('statsAssetsDays') statsAssetsDays: string[] = [];

  // Boolean per bottoni e titoli Add Stats
  isAddStatsSelected: boolean = false;
  isResumeAddAssets: boolean = false;

  saveValidation: boolean = false;
  // Used for warning date
  dateValidation: boolean = false;
  dateStats: string = '';

  currentIndex: number = 0;

  constructor(
    private cryptoService: CryptoService,
    private errorService: ErrorService,
    private router: Router,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    console.log('INIT');
  }

  /**
   * ADD STATS METHODS
   */
  addStatsClick() {
    this.isAddStatsSelected = true;
    // Ho bisogno di fare un check della history perchè se non c'è una history devo crearne una vuota
    let stats = new Stats();
    stats.balance = 0;
    stats.date = new Date();
    stats.percentage = 0;
    stats.trend = 0;
    this.assets.forEach((asset) => {
      if (asset.history == undefined || asset.history.length == 0) {
        asset.history = [stats];
      }
    });
  }
  changeAsset() {
    this.currentIndex += 1;
    let element = document.getElementById('action-scheet');
    element?.scrollTo(0, 0);
    if (this.currentIndex == this.assets.length) {
      this.confirm();
      this.isResumeAddAssets = true;
    }
  }

  filterWallets(wallets: Wallet[], assetName: string): Wallet[] {
    let wallAsset = wallets.filter((w) => {
      if (w.assets != undefined && w.assets.length > 0)
        return w.assets.find((a) => a.name == assetName);
      return null;
    });
    /*wallAsset.forEach((w) => {
      w.assets = w.assets.filter((a) => a.name == assetName);
    });*/
    return wallAsset;
  }

  // Mi serve per filtrare gli asset prima di fare Add Stats
  filterAsset(wallet: Wallet, assetName: string): Asset {
    return wallet.assets.find((a) => a.name == assetName)!;
  }

  validateDate() {
    this.dateValidation = false;
    let validate = false;
    let statsWalletDays = this.statsAssetsDays;
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

  confirm() {
    let statsWalletDays = this.statsAssetsDays;

    this.wallets.forEach((wallet) => {
      // Check Wallet Date if is before the current date to prevert the update of the data

      wallet.assets.forEach((asset) => {
        let stats: Stats = new Stats();
        this.setDataForNewStats(asset, statsWalletDays, stats);
        asset.newValue = parseFloat('');
      });
    });
    this.cryptoService.cryptoDashboard.statsAssetsDays.push(this.dateStats);
    this.cryptoService.cryptoDashboard.statsAssetsDays.sort();
    this.saveValidation = true;
  }

  setDataForNewStats(asset: Asset, statsWalletDays: string[], stats: Stats) {
    /* trovo gli indici corrispondenti da analizzare inserendo la data corrente
     * all'interno della lista di date e trovo l'indice della mia data
     */
    const days: any = [];
    if (statsWalletDays && statsWalletDays.length > 0) {
      statsWalletDays.forEach((d) => {
        days.push(d);
      });
    }

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
        asset.history?.find((w) => w.date == undefined)!
      ) {
        this.errorService.handleWalletStatsError();
        this.router.navigate(['error']);
      }

      afterThisStats = asset.history?.find(
        (w) => w.date.toString() === days[indexDate + 1]
      )!;

      // Modifico i dati delle percentuali e trend
      let percentageAfterThisStats = (
        ((afterThisStats.balance -
          (asset.newValue! != 0 ? asset.newValue! : 0.001)) /
          (asset.newValue! != 0 ? asset.newValue! : 0.001)) *
        100
      ).toFixed(2);
      afterThisStats.percentage =
        parseFloat(percentageAfterThisStats) > 10000
          ? 1000
          : parseFloat(percentageAfterThisStats);
      afterThisStats.trend = parseFloat(
        (afterThisStats.balance - asset.newValue!).toFixed(2)
      );
    }
    if (days[indexDate - 1]) {
      beforeThisStats = asset.history?.find(
        (w) => w.date != undefined && w.date.toString() === days[indexDate - 1]
      )!;
      if (beforeThisStats == undefined) {
        beforeThisStats = new Stats();
        beforeThisStats.balance = 0.001;
      }
    }
    let percentageThisStats = (
      ((asset.newValue! - beforeThisStats.balance) / beforeThisStats.balance) *
      100
    ).toFixed(2);

    stats.balance = asset.newValue!;
    stats.date = new Date(this.dateStats);
    stats.percentage =
      parseFloat(percentageThisStats) > 10000
        ? 1000
        : parseFloat(percentageThisStats);
    if (days.length > 1) {
      stats.trend = parseFloat(
        (
          stats.balance -
          (beforeThisStats.balance != 0.001 ? beforeThisStats.balance : 0)
        ).toFixed(2)
      );
    } else stats.trend = 0;

    // Ultimo
    if (!afterThisStats.balance) {
      if (!beforeThisStats.date) {
        stats.percentage = 0;
      }

      asset.lastUpdate = stats.date;
      asset.value = stats.balance;

      asset.history = [stats];
    } else if (afterThisStats.balance && indexDate === days.length - 2) {
      asset.history = [afterThisStats, stats];
    } else {
      asset.history = [afterThisStats, stats];
    }
  }

  save() {
    console.log(this.wallets);
    this.saveValidation = false;
    this.statsService.addStats(this.wallets).subscribe((data) => {
      this.wallets = data.data;
    });
    this.getTodayAsString();
    this.resetForm();
  }
  getTodayAsString() {
    let today = new Date().toISOString().split('T')[0];
    this.dateStats = today;
  }
  /**
   * END ADD STATS METHODS
   */

  resetForm() {
    this.isAddStatsSelected = false;
    this.isResumeAddAssets = false;
    this.saveValidation = false;
    this.dateValidation = false;
    this.dateStats = '';
    this.currentIndex = 0;
  }
}
