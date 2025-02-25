import {
  Component,
  CSP_NONCE,
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
  standalone: false,
})
export class AddCryptoStatsComponent implements OnInit, OnChanges, OnDestroy {
  // Subscribe
  addStats: Subscription = new Subscription();
  @Input('assets') assets: Asset[] = [];
  @Input('currency') currency: string = '';
  @Input('allWallets') allWallets: Wallet[] = [];

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

  wallets: Wallet[] = [];

  constructor(
    private errorService: ErrorService,
    private router: Router,
    private statsService: StatsService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.wallets = Utils.copyObject(this.allWallets);
    this.deleteTradingWallet();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.wallets = Utils.copyObject(this.allWallets);
    this.deleteTradingWallet();
  }

  deleteTradingWallet() {
    this.getTodayAsString();
    if (this.wallets && this.wallets.length > 0)
      this.wallets = this.wallets.filter(
        (wallet) => wallet.type && wallet.type == 'Holding'
      );
    let assetList: Array<string> = [];
    if (!Utils.isNullOrEmpty(this.wallets)) {
      this.wallets.forEach((w) => {
        if (w.assets)
          w.assets.forEach((a) => {
            if (!assetList.includes(a.symbol!)) {
              assetList.push(a.symbol!);
            }
          });
      });
      this.assets = this.cryptoService.getAssetList(this.wallets);
      this.assets = this.assets.filter((a) => a.balance > 0);
      this.assets = this.assets.filter((a) => assetList.includes(a.symbol!));
    }
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
    const statsWalletDays = this.statsAssetsDays;
    //const assetsList = this.cryptoService.getAssetList(this.allWallets);

    this.wallets.forEach((wallet) => {
      // Verifico se il wallet contiene assets
      wallet.assets?.forEach((asset) => {
        // Eseguo l'operazione solo se il balance dell'asset è maggiore di 0
        if (asset.balance > 0) {
          // Trovo l'asset corrispondente nella lista assets e ne recupero la history
          //const matchedAsset = assetsList.find(
          //  (a) => a.identifier === asset.identifier
          //);
          //if (matchedAsset?.history) {
          //  // Aggiungo la history trovata all'asset corrente
          //  asset.history = [...(asset.history || []), ...matchedAsset.history];
          //}
          // Creo un nuovo oggetto Stats e imposto i dati per il nuovo stat
          const stats = new Stats();
          this.setDataForNewStats(asset, statsWalletDays, stats);
          // Fix Error Code: undefined,  Message: Converting circular structure to JSON
          if (!Utils.isNullOrEmpty(asset.operations))
            asset.operations.forEach((o) => {
              o.asset = undefined;
              o.assetSell = undefined;
              o.wallet = undefined;
            });

          // Resetto il valore di newValue per l'asset
          asset.newValue = 0; // Imposto 0 invece di una stringa vuota
        }
      });
    });

    // Imposto il flag di validazione come true
    this.saveValidation = true;
  }
  setDataForNewStats(asset: Asset, statsWalletDays: string[], stats: Stats) {
    const days = [...(statsWalletDays || []), this.dateStats].sort();
    const indexDate = days.indexOf(this.dateStats);

    if (indexDate === -1) {
      this.errorService.handleWalletStatsError();
      this.router.navigate(['error']);
      return;
    }

    const findStatsByDate = (date: string | undefined) =>
      date
        ? asset.history?.find((w) => w.date?.toString() === date)
        : undefined;

    const beforeThisStats = findStatsByDate(days[indexDate - 1]) || new Stats();
    beforeThisStats.balance ||= 0.001;

    const afterThisStats = findStatsByDate(days[indexDate + 1]);

    if (!afterThisStats && asset.history?.some((w) => w.date === undefined)) {
      this.errorService.handleWalletStatsError();
      this.router.navigate(['error']);
      return;
    }

    const calculatePercentage = (newValue: number, oldValue: number) =>
      oldValue !== 0
        ? parseFloat((((newValue - oldValue) / newValue) * 100).toFixed(2))
        : 0;

    const calculateTrend = (newValue: number, oldValue: number) =>
      parseFloat((newValue - oldValue).toFixed(2));

    const newValue = asset.newValue || 0.001;

    if (afterThisStats) {
      afterThisStats.percentage = Math.min(
        calculatePercentage(afterThisStats.balance, newValue),
        1000
      );
      afterThisStats.trend = calculateTrend(afterThisStats.balance, newValue);
    }

    stats.balance = newValue;
    stats.date = new Date(this.dateStats);
    stats.percentage = Math.min(
      calculatePercentage(newValue, beforeThisStats.balance),
      1000
    );
    stats.trend =
      days.length > 1
        ? calculateTrend(
            newValue,
            beforeThisStats.balance !== 0.001 ? beforeThisStats.balance : 0
          )
        : 0;

    if (!afterThisStats) {
      if (!beforeThisStats.date) stats.percentage = 0;
      asset.lastUpdate = stats.date;
      asset.value = stats.balance;
      asset.history = [stats];
    } else {
      asset.history = [afterThisStats, stats];
    }
  }

  setDataForNewStatsOld(asset: Asset, statsWalletDays: string[], stats: Stats) {
    // Preparo la lista delle date da analizzare e aggiungo la data corrente
    const days = [...(statsWalletDays || []), this.dateStats].sort();
    const indexDate = days.indexOf(this.dateStats);

    if (indexDate === -1) {
      this.errorService.handleWalletStatsError();
      this.router.navigate(['error']);
      return;
    }

    // Trovo gli stats immediatamente precedenti e successivi
    const beforeThisStats = (() => {
      const previousDate = days[indexDate - 1];
      if (previousDate) {
        const stats = asset.history?.find(
          (w) => w.date?.toString() === previousDate
        );
        if (stats) return stats;
      }
      const defaultStats = new Stats();
      defaultStats.balance = 0.001;
      return defaultStats;
    })();

    const afterThisStats = (() => {
      const nextDate = days[indexDate + 1];
      if (nextDate) {
        return asset.history?.find((w) => w.date?.toString() === nextDate);
      }
      return undefined;
    })();

    if (!afterThisStats && asset.history?.some((w) => w.date === undefined)) {
      this.errorService.handleWalletStatsError();
      this.router.navigate(['error']);
      return;
    }

    // Calcolo le percentuali e i trend per gli stats successivi
    if (afterThisStats) {
      const newValue = asset.newValue || 0.001;
      const percentageAfter = (
        ((afterThisStats.balance - newValue) / newValue) *
        100
      ).toFixed(2);
      afterThisStats.percentage = Math.min(parseFloat(percentageAfter), 1000);
      afterThisStats.trend = parseFloat(
        (afterThisStats.balance - newValue).toFixed(2)
      );
    }

    // Calcolo le percentuali e i trend per gli stats correnti
    const percentageThis =
      beforeThisStats.balance !== 0
        ? (
            ((asset.newValue! - beforeThisStats.balance) /
              beforeThisStats.balance) *
            100
          ).toFixed(2)
        : '0';

    stats.balance = asset.newValue || 0;
    stats.date = new Date(this.dateStats);
    stats.percentage = Math.min(parseFloat(percentageThis), 1000);
    stats.trend =
      days.length > 1
        ? parseFloat(
            (
              stats.balance -
              (beforeThisStats.balance !== 0.001 ? beforeThisStats.balance : 0)
            ).toFixed(2)
          )
        : 0;

    // Aggiorno l'history dell'asset
    if (!afterThisStats) {
      if (!beforeThisStats.date) {
        stats.percentage = 0;
      }
      asset.lastUpdate = stats.date;
      asset.value = stats.balance;
      asset.history = [stats];
    } else if (indexDate === days.length - 2) {
      asset.history = [afterThisStats, stats];
    } else {
      asset.history = [afterThisStats, stats];
    }
  }

  setDataForNewStatsOldOld(
    asset: Asset,
    statsWalletDays: string[],
    stats: Stats
  ) {
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

  get isGraphEmptyOrZero(): boolean {
    return (
      !this.assets?.length || this.assets.every((asset) => asset.balance === 0)
    );
  }
}
