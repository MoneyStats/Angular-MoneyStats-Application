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
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-asset-modal',
  templateUrl: './add-asset-modal.component.html',
  styleUrls: ['./add-asset-modal.component.scss'],
  standalone: false,
})
export class AddAssetModalComponent implements OnInit, OnDestroy {
  getMarketDataSubscribe: Subscription = new Subscription();
  saveAssetSubscription: Subscription = new Subscription();

  environment = environment;
  @Input('modalId') modalId: string = '';
  @Input('cryptoCurrency') cryptoCurrency: string = '';
  coinSymbol: string = UserService.getUserData().settings.currencySymbol;
  @Output('emitAddAsset') emitAddAsset = new EventEmitter<Wallet>();

  asset?: Asset;
  modelAsset: string = '';
  isAssetSelected: boolean = false;
  warning: boolean = false;
  balance?: number;
  invested?: number;

  @Input('marketData') marketData: Asset[] = [];

  @Input('wallets') wallets: Wallet[] = [];
  wallet?: Wallet;
  modelWallet: string = '';
  isWalletSelected: boolean = false;

  cryptoTypes: string[] = ['Holding', 'Trading'];
  cryptoPrices: Asset[] = [];
  search: string = '';

  categories: Category[] = [];

  falseIf: boolean = false;

  constructor(public cryptoService: CryptoService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get assetConstant(): typeof SelectAssetConstant {
    return SelectAssetConstant;
  }

  ngOnInit(): void {
    if (!Utils.isNullOrEmpty(this.wallets))
      this.wallets = this.wallets.filter((w) => w.category == 'Crypto');
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
      this.saveAssetSubscription = this.cryptoService
        .addCryptoAsset(this.wallet!)
        .subscribe((data) => {
          LOG.info(data.message!, 'AddAssetModalComponent');
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
