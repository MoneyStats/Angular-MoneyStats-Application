import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ImageColorPickerService } from 'src/assets/core/utils/image.color.picker.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { v4 as uuidv4 } from 'uuid';
import {
  ApexChartsOptions,
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { Subscription } from 'rxjs';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { UserService } from 'src/assets/core/services/api/user.service';

@Component({
  selector: 'app-details-overview',
  templateUrl: './details-overview.component.html',
  styleUrls: ['./details-overview.component.scss'],
  standalone: false,
})
export class DetailsOverviewComponent implements OnInit, OnChanges, OnDestroy {
  updateinvestmentSubscribe: Subscription = new Subscription();

  amount: string = '******';
  @Input('hidden') hidden: boolean = false;
  public chartOptions?: Partial<ApexOptions>;
  public chart1Y?: Partial<ApexOptions>;
  public chart3Y?: Partial<ApexOptions>;
  @Input('asset') asset: Asset = new Asset();
  @Input('assetName') assetName: string = '';
  @Input('cryptoDashboard') cryptoDashboard: CryptoDashboard =
    new CryptoDashboard();

  walletsAsset: Wallet[] = [];

  @Input('cryptoWallets') cryptoWallets: Array<Wallet> = [];
  @Input('cryptoAssets') cryptoAssets: Array<Asset> = [];

  isEditInvestmentActive: boolean = false;

  operationSelect: any;

  showZeroBalance: boolean = false;

  thisYear: number = new Date().getFullYear();

  cryptoCurrency?: string = UserService.getUserData().attributes.money_stats_settings.cryptoCurrency;

  constructor(public cryptoService: CryptoService, private router: Router) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    ScreenService.hideFooter();
    this.getAsset();
  }

  ngOnInit(): void {
    this.getAsset();
  }

  ngOnDestroy(): void {
    this.updateinvestmentSubscribe.unsubscribe();
  }

  setColor() {
    this.resetColor();
    const activeElem = document.querySelectorAll('.active');
    activeElem.forEach((e, index) => {
      if (e.getAttribute('class')?.includes('graph-tab')) {
        let color = ImageColorPickerService.getColor(this.asset.icon!, 0);
        e.setAttribute(
          'style',
          'color: ' + color + '; border-bottom-color: ' + color + ' !important'
        );
      }
    });
  }

  resetColor() {
    const activeElem = document.querySelectorAll('.graph-tab');
    activeElem.forEach((e) => {
      if (!e.getAttribute('class')?.includes('active')) {
        e.removeAttribute('style');
      }
    });
  }

  getAsset() {
    this.graph1Y();
    this.walletsAsset = this.filterWallets();
    this.setColor();
  }

  graphAll() {
    this.setColor();
    if (!this.chartOptions) {
      let dashboard: CryptoDashboard = Utils.copyObject(this.cryptoDashboard);
      dashboard.assets = [Utils.copyObject(this.asset)];
      // Get All Date serve a prendere tutte le date per i grafici
      dashboard.statsAssetsDays = this.getAllDate(dashboard.assets);
      setTimeout(() => {
        if (ScreenService.isMobileDevice()) {
          this.chartOptions = ChartService.renderCryptoDatas(dashboard, true, [
            ApexChartsOptions.MOBILE_MODE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
        } else
          this.chartOptions = ChartService.renderCryptoDatas(dashboard, true, [
            ApexChartsOptions.DESKTOP_MODE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
      }, 500);
    }
  }

  graph1Y() {
    this.setColor();
    if (!this.chart1Y) {
      let dashboard: CryptoDashboard = Utils.copyObject(this.cryptoDashboard);
      dashboard.assets = [Utils.copyObject(this.asset)];
      // Get All Date serve a prendere tutte le date per i grafici
      dashboard.statsAssetsDays = this.getAllDate(dashboard.assets);
      if (dashboard.assets[0]) {
        dashboard.assets[0].history = dashboard.assets[0].history?.filter(
          (h) =>
            h.date.toString().split('-')[0] ===
            new Date().getFullYear().toString()
        );
        if (dashboard.statsAssetsDays)
          dashboard.statsAssetsDays = dashboard.statsAssetsDays.filter(
            (s) =>
              s.toString().split('-')[0] === new Date().getFullYear().toString()
          );
        setTimeout(() => {
          if (ScreenService.isMobileDevice())
            this.chart1Y = ChartService.renderCryptoDatas(dashboard, true, [
              ApexChartsOptions.MOBILE_MODE,
              ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
            ]);
          else
            this.chart1Y = ChartService.renderCryptoDatas(dashboard, true, [
              ApexChartsOptions.DESKTOP_MODE,
              ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
            ]);
        }, 500);
      }
    }
  }

  graph3Y() {
    this.setColor();
    if (!this.chart3Y) {
      let dashboard: CryptoDashboard = Utils.copyObject(this.cryptoDashboard);

      dashboard.assets = [Utils.copyObject(this.asset)];
      // Get All Date serve a prendere tutte le date per i grafici
      dashboard.statsAssetsDays = this.getAllDate(dashboard.assets);
      let last3 = [
        new Date().getFullYear().toString(),
        (new Date().getFullYear() - 1).toString(),
        (new Date().getFullYear() - 2).toString(),
      ];
      let last3Years = dashboard.assets[0].history?.filter((h) =>
        last3.includes(h.date.toString().split('-')[0])
      );
      dashboard.assets[0].history = last3Years;

      if (dashboard.statsAssetsDays)
        dashboard.statsAssetsDays = dashboard.statsAssetsDays.filter((s) =>
          last3.includes(s.toString().split('-')[0])
        );
      setTimeout(() => {
        if (ScreenService.isMobileDevice())
          this.chart3Y = ChartService.renderCryptoDatas(dashboard, true, [
            ApexChartsOptions.MOBILE_MODE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
        else
          this.chart3Y = ChartService.renderCryptoDatas(dashboard, true, [
            ApexChartsOptions.DESKTOP_MODE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
      }, 500);
    }
  }

  percentageAssetInTotal(): number {
    const res = (this.asset.value! * 100) / this.cryptoDashboard.balance;
    return !Utils.isNullOrEmpty(res) ? res : 0;
  }

  filterWallets(): Wallet[] {
    let name = this.asset.name;
    const wallets = Utils.copyObject(this.cryptoWallets);
    let wallAsset = wallets
      ? wallets.filter((w: { assets: any[] | undefined }) => {
          if (w.assets != undefined && w.assets.length != 0)
            return w.assets.slice().find((a) => a.name == name);
          return null;
        })
      : [];
    wallAsset.forEach((w: any) => {
      w.assets = w.assets.slice().filter((a: any) => a.name == name);
      if (w.assets[0].history == undefined) {
        w.assets[0].history = [];
      } else if (w.assets[0].history) {
        w.assets[0].history = w.assets[0].history.filter(
          (h: Stats) =>
            h.date.toString().split('-')[0] ===
            new Date().getFullYear().toString()
        );
      }
    });
    return wallAsset;
  }

  getOperations() {
    let wallets = Utils.copyObject(this.walletsAsset);
    let assets = Utils.copyObject(this.cryptoAssets);
    let operations: any[] = [];
    wallets.forEach((wallet: any) => {
      if (
        wallet.assets &&
        wallet.assets.length > 0 &&
        wallet.assets[0].operations &&
        wallet.assets[0].operations.length > 0
      )
        wallet.assets[0].operations.forEach((operation: any) => {
          operation.wallet = wallet;
          operation.asset = wallet.assets[0];
          if (operation.type != OperationsType.NEWINVESTMENT)
            operation.assetSell = assets.find(
              (a: { symbol: any }) => a.symbol == operation.entryCoin
            );
          operations.push(operation);
        });
    });
    operations.sort((a, b) => (a.exitDate! < b.exitDate! ? 1 : -1));
    return operations;
  }

  updateInvestment(wallet: Wallet) {
    this.isEditInvestmentActive = false;
    this.updateinvestmentSubscribe = this.cryptoService
      .updateCryptoAsset(wallet)
      .subscribe((data) => {
        LOG.info(data.message!, 'DetailsOverviewComponent');
      });

    let wallets = Utils.copyObject(this.cryptoWallets);
    let walletsFullList: Wallet[] = Utils.copyObject(this.walletsAsset);
    let invested = 0;
    let balance = 0;
    wallets.forEach((w: any) => {
      invested += w.assets[0].invested;
      balance += w.assets[0].balance;
      walletsFullList
        .find((w1) => w1.name == w.name)!
        .assets.find((a) => a.identifier == w.assets[0].identifier)!.balance =
        w.assets[0].balance;
      walletsFullList
        .find((w1) => w1.name == w.name)!
        .assets.find((a) => a.identifier == w.assets[0].identifier)!.invested =
        w.assets[0].invested;
    });
    this.asset.invested = invested;
    this.asset.balance = balance;
  }

  goToOperations() {
    let uuid = uuidv4();
    this.cryptoService.operationsMap.set(uuid, this.getOperations());
    this.router.navigate([
      '/crypto/operations/' + this.cryptoDashboard.currency + '/' + uuid,
    ]);
  }

  selectOperation(operation: any) {
    this.operationSelect = operation;
  }

  getAllDate(assets: Asset[]): string[] {
    let date: string[] = [];
    if (assets)
      assets.forEach((a) => {
        if (a && a.history)
          a.history?.forEach((h) => {
            if (!date.find((d) => d == h.date.toString()))
              date.push(h.date.toString());
          });
      });
    date.sort();
    return date;
  }

  zeroBalanceSwitch() {
    return this.showZeroBalance
      ? (this.showZeroBalance = false)
      : (this.showZeroBalance = true);
  }

  validateWallet(wallet: Wallet) {
    return (
      wallet.assets[0] == undefined ||
      wallet.assets[0].history == undefined ||
      wallet.assets[0].history.length == 0
    );
  }

  calculatePerformance(asset: Asset) {
    const res = ((asset.value! - asset.invested!) / asset.invested!) * 100;
    return !Utils.isNullOrEmpty(res) ? res : 0;
  }

  get isAssetListEmptyOrZero(): boolean {
    return !this.showZeroBalance
      ? !this.walletsAsset?.length ||
          this.walletsAsset.every(
            (wallet) =>
              wallet.balance === 0 ||
              wallet.assets.every((a) => a.balance === 0)
          )
      : false;
  }

  get isWalletHasZero(): boolean {
    return (
      this.walletsAsset?.some((wallet) =>
        wallet.assets.some((asset) => asset.balance === 0)
      ) ?? false
    );
  }
}
