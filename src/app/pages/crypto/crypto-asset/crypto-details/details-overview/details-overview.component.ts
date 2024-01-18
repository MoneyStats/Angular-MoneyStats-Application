import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ImageColorPickerService } from 'src/assets/core/utils/image.color.picker.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { v4 as uuidv4 } from 'uuid';
import {
  ApexChartsOptions,
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-overview',
  templateUrl: './details-overview.component.html',
  styleUrls: ['./details-overview.component.scss'],
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

  isEditInvestmentActive: boolean = false;

  operationSelect: any;

  showZeroBalance: boolean = false;

  thisYear: number = new Date().getFullYear();

  constructor(
    public cryptoService: CryptoService,
    private screenService: ScreenService,
    private charts: ChartService,
    public imageColorPicker: ImageColorPickerService,
    private logger: LoggerService,
    private router: Router
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenService.hideFooter();
    this.getAsset();
  }

  ngOnInit(): void {
    //this.cryptoDashboard = deepCopy(this.cryptoService.cryptoDashboard);

    /*let dashboard: CryptoDashboard = new CryptoDashboard();
    dashboard.statsAssetsDays = this.cryptoDashboard.statsAssetsDays;
    dashboard.assets = [
      this.asset.name == undefined ? this.cryptoService.asset! : this.asset,
    ];*/
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
        let color = this.imageColorPicker.getColor(this.asset.icon!, 0);
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
      let dashboard: CryptoDashboard = deepCopy(this.cryptoDashboard);
      dashboard.assets = [
        this.asset.name == undefined
          ? deepCopy(this.cryptoService.asset!)
          : deepCopy(this.asset),
      ];
      // Get All Date serve a prendere tutte le date per i grafici
      dashboard.statsAssetsDays = this.getAllDate(dashboard.assets);
      setTimeout(() => {
        if (this.cryptoDashboard.wallets) {
          if (this.screenService?.screenWidth! <= 780) {
            this.chartOptions = this.charts.renderCryptoDatas(dashboard, [
              ApexChartsOptions.MOBILE_MODE,
              ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
            ]);
          } else
            this.chartOptions = this.charts.renderCryptoDatas(dashboard, [
              ApexChartsOptions.DESKTOP_MODE,
              ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
            ]);
        }
      }, 500);
    }
  }

  graph1Y() {
    this.setColor();
    if (!this.chart1Y) {
      let dashboard: CryptoDashboard = deepCopy(this.cryptoDashboard);
      dashboard.assets = [
        this.asset.name == undefined
          ? deepCopy(this.cryptoService.asset!)
          : deepCopy(this.asset),
      ];
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
          if (this.screenService?.screenWidth! <= 780)
            this.chart1Y = this.charts.renderCryptoDatas(dashboard, [
              ApexChartsOptions.MOBILE_MODE,
              ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
            ]);
          else
            this.chart1Y = this.charts.renderCryptoDatas(dashboard, [
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
      let dashboard: CryptoDashboard = deepCopy(this.cryptoDashboard);

      dashboard.assets = [
        this.asset.name == undefined
          ? deepCopy(this.cryptoService.asset!)
          : deepCopy(this.asset),
      ];
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
        if (this.screenService?.screenWidth! <= 780)
          this.chart3Y = this.charts.renderCryptoDatas(dashboard, [
            ApexChartsOptions.MOBILE_MODE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
        else
          this.chart3Y = this.charts.renderCryptoDatas(dashboard, [
            ApexChartsOptions.DESKTOP_MODE,
            ApexChartsOptions.LIVE_PRICE_AS_LAST_DATA,
          ]);
      }, 500);
    }
  }

  percentageAssetInTotal(): number {
    return (this.asset.value! * 100) / this.cryptoDashboard.balance;
  }

  filterWallets(): Wallet[] {
    let name =
      this.asset.name == undefined
        ? this.cryptoService.asset?.name
        : this.asset.name;
    const dashboard = deepCopy(this.cryptoDashboard);
    let wallAsset = dashboard.wallets
      ? dashboard.wallets.filter((w) => {
          if (w.assets != undefined && w.assets.length != 0)
            return w.assets.slice().find((a) => a.name == name);
          return null;
        })
      : [];
    wallAsset.forEach((w) => {
      w.assets = w.assets.slice().filter((a) => a.name == name);
      if (w.assets[0].history == undefined) {
        w.assets[0].history = [];
      }
    });
    return wallAsset;
  }

  getOperations() {
    let wallets = deepCopy(this.walletsAsset);
    let operations: any[] = [];
    wallets.forEach((wallet) => {
      if (
        wallet.assets &&
        wallet.assets.length > 0 &&
        wallet.assets[0].operations &&
        wallet.assets[0].operations.length > 0
      )
        wallet.assets[0].operations.forEach((operation) => {
          operation.wallet = wallet;
          operation.asset = wallet.assets[0];
          if (operation.type != OperationsType.NEWINVESTMENT)
            operation.assetSell = this.cryptoDashboard.assets.find(
              (a) => a.symbol == operation.entryCoin
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
      .addOrUpdateCryptoAsset(wallet)
      .subscribe((data) => {
        this.logger.LOG(data.message!, 'DetailsOverviewComponent');
      });

    let wallets = deepCopy(this.walletsAsset);
    let invested = 0;
    let balance = 0;
    wallets.forEach((w) => {
      invested += w.assets[0].invested;
      balance += w.assets[0].balance;
      this.cryptoService.cryptoDashboard.wallets
        .find((w1) => w1.name == w.name)!
        .assets.find((a) => a.identifier == w.assets[0].identifier)!.balance =
        w.assets[0].balance;
      this.cryptoService.cryptoDashboard.wallets
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
}
