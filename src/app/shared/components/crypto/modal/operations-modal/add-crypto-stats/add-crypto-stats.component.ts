import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ErrorService } from 'src/assets/core/interceptors/error.service';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { StatsService } from 'src/assets/core/services/api/stats.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';

@Component({
  selector: 'app-add-crypto-stats',
  templateUrl: './add-crypto-stats.component.html',
  styleUrls: ['./add-crypto-stats.component.scss'],
})
export class AddCryptoStatsComponent implements OnInit, OnChanges, OnDestroy {
  // Subscribe
  addStats: Subscription = new Subscription();
  @Input('assets') assets: Asset[] = [];
  @Input('currency') currency: string = '';
  @Input('wallets') wallets: Wallet[] = [];
  // Boolean per bottoni e titoli Add Stats
  @Input('isAddStatsSelected') isAddStatsSelected: boolean = false;
  @Input('isResumeAddAssets') isResumeAddAssets: boolean = false;

  @Input('statsAssetsDays') statsAssetsDays: string[] = [];

  @Input('currentIndex') currentIndex: number = 0;
  @Output('emitAddStats') emitAddStats = new EventEmitter<Wallet[]>();

  saveValidation: boolean = false;
  // Used for warning date
  dateValidation: boolean = false;
  dateStats: string = '';

  constructor(
    private cryptoService: CryptoService,
    private errorService: ErrorService,
    private router: Router,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.deleteTradingWallet();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.deleteTradingWallet();
  }

  deleteTradingWallet() {
    this.getTodayAsString();
    if (this.wallets && this.wallets.length > 0)
      this.wallets = this.wallets.filter(
        (wallet) => wallet.type && wallet.type == 'Holding'
      );
    let assetList: Array<string> = [];
    if (!Utils.isNullOrEmpty(this.wallets))
      this.wallets.forEach((w) => {
        if (w.assets)
          w.assets.forEach((a) => {
            if (!assetList.includes(a.symbol!)) {
              assetList.push(a.symbol!);
            }
          });
      });
    this.assets = this.assets.filter((a) => assetList.includes(a.symbol!));
  }

  filterWallets(wallets: Wallet[], assetName: string): Wallet[] {
    let wallAsset = wallets.filter((w) => {
      if (w.assets != undefined && w.assets.length > 0)
        return w.assets.find((a) => a.name == assetName && a.balance > 0);
      return null;
    });
    return wallAsset;
  }

  // Mi serve per filtrare gli asset prima di fare Add Stats
  filterAsset(wallet: Wallet, assetName: string): Asset {
    return wallet.assets.find((a) => a.name == assetName && a.balance > 0)!;
  }

  changeAsset() {
    this.currentIndex += 1;
    let element = document.getElementById('action-scheet');
    element?.scrollTo(0, 0);
    if (this.currentIndex == this.assets.length) {
      this.confirm();
      this.isResumeAddAssets = true;
      return;
    }
    // Cambio automaticamente asset se il balance è 0
    if (
      this.assets[this.currentIndex] == undefined ||
      this.assets[this.currentIndex].balance == 0
    )
      this.changeAsset();
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
      if (wallet.assets)
        wallet.assets.forEach((asset) => {
          // Non setto i dati se l'asset ha balance uguale a 0
          if (asset.balance > 0) {
            let stats: Stats = new Stats();
            this.setDataForNewStats(asset, statsWalletDays, stats);
            asset.newValue = parseFloat('');
          }
        });
    });
    //if (this.cryptoService.cryptoDashboard.statsAssetsDays) {
    //  this.cryptoService.cryptoDashboard.statsAssetsDays.push(this.dateStats);
    //} else
    //  this.cryptoService.cryptoDashboard.statsAssetsDays = [this.dateStats];
    //
    //this.cryptoService.cryptoDashboard.statsAssetsDays.sort();
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
    let percentageThisStats =
      beforeThisStats.balance != 0
        ? (
            ((asset.newValue! - beforeThisStats.balance) /
              beforeThisStats.balance) *
            100
          ).toFixed(2)
        : '0';

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
    this.saveValidation = false;
    this.addStats = this.statsService
      .addStatsData(this.wallets)
      .subscribe((data) => {
        LOG.info(data.message!, 'AddCryptoStatsComponent');
        this.wallets = data.data;
        this.emitAddStats.emit(this.wallets);
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

  ngOnDestroy(): void {
    this.addStats.unsubscribe();
  }
}
