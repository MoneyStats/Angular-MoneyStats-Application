import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Category, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  SelectAssetConstant,
} from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-asset-modal',
  templateUrl: './add-asset-modal.component.html',
  styleUrls: ['./add-asset-modal.component.scss'],
})
export class AddAssetModalComponent implements OnInit, OnDestroy {
  getMarketDataSubscribe: Subscription = new Subscription();
  saveAssetSubscription: Subscription = new Subscription();

  environment = environment;
  @Input('modalId') modalId: string = '';
  @Input('cryptoCurrency') cryptoCurrency: string = '';
  @Output('emitAddAsset') emitAddAsset = new EventEmitter<Wallet>();

  asset?: Asset;
  modelAsset: string = '';
  isAssetSelected: boolean = false;
  warning: boolean = false;
  balance?: number;
  invested?: number;

  marketData: Asset[] = [];

  @Input('wallets') wallets: Wallet[] = [];
  wallet?: Wallet;
  modelWallet: string = '';
  isWalletSelected: boolean = false;

  cryptoTypes: string[] = ['Holding', 'Trading'];
  cryptoPrices: Asset[] = [];
  search: string = '';

  categories: Category[] = [];

  falseIf: boolean = false;

  constructor(
    public dashboardService: DashboardService,
    public cryptoService: CryptoService,
    private logger: LoggerService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get assetConstant(): typeof SelectAssetConstant {
    return SelectAssetConstant;
  }

  ngOnInit(): void {
    this.getCryptoPrices();
    this.categories = this.dashboardService.dashboard.categories;
    if (this.wallets == undefined && this.dashboardService.dashboard.wallets) {
      this.wallets = this.dashboardService.dashboard.wallets.filter(
        (w) => w.category == 'Crypto'
      );
      //if (this.wallets && this.wallets.length != 0) {
      //  //if (this.wallets && this.wallets.length == 1) {
      //  this.modelWallet = this.wallets[0].name;
      //}
    } else this.wallets;
  }

  getCryptoPrices() {
    this.getMarketDataSubscribe = this.cryptoService
      .getCryptoPrice(this.cryptoCurrency)
      .subscribe((data) => {
        this.logger.LOG(data.message!, 'AddAssetModalComponent');
        this.marketData = data.data;
      });
  }

  selectWallet() {
    this.wallet = this.wallets.find((w) => w.name == this.modelWallet);
    this.isWalletSelected = true;
  }

  selectAsset() {
    if (
      !this.wallet?.assets ||
      (this.wallet?.assets.length > 0 &&
        !this.wallet?.assets.find((a) => a.name == this.modelAsset))
    ) {
      this.warning = false;
      this.asset = this.cryptoPrices.find((c) => c.name == this.modelAsset);
      this.isAssetSelected = true;
    } else this.warning = true;
  }

  saveAsset() {
    if (
      !this.wallet?.assets ||
      (this.wallet?.assets.length > 0 &&
        !this.wallet?.assets.find((a) => a.name == this.asset?.name))
    ) {
      this.warning = false;
      if (this.wallet?.assets == undefined) {
        this.wallet!.assets = [];
      }
      this.asset!.id = undefined;
      this.asset!.balance = this.balance!;
      this.asset!.invested = this.invested!;
      this.asset!.performance = 0;
      this.asset!.trend = 0;
      this.asset!.lastUpdate = new Date();
      //this.wallet?.assets.push(this.asset!);
      this.wallet!.assets = [this.asset!];
      console.log(this.wallet);
      this.saveAssetSubscription = this.cryptoService
        .addOrUpdateCryptoAsset(this.wallet!)
        .subscribe((data) => {
          console.log(data);
          this.emitAddAsset.emit(data.data);
          this.resetModal();
        });
    } else {
      this.isAssetSelected = false;
      this.modelAsset = '';
      this.warning = true;
    }
  }

  resetModal() {
    this.warning = false;
    this.isAssetSelected = false;
    this.isWalletSelected = false;
    this.modelAsset = '';
    this.modelWallet = '';
  }

  emitSelectAsset(asset: Asset) {
    this.warning = false;
    this.cryptoPrices = [asset];
    this.modelAsset = asset.name!;
  }

  ngOnDestroy(): void {
    this.getMarketDataSubscribe.unsubscribe();
    this.saveAssetSubscription.unsubscribe();
  }
}
