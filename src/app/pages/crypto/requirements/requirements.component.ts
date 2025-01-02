import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { Status, User } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { WalletService } from 'src/assets/core/services/api/wallet.service';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { Asset } from 'src/assets/core/data/class/crypto.class';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
  standalone: false,
})
export class RequirementsComponent implements OnInit, OnDestroy {
  walletsSubscribe: Subscription = new Subscription();
  marketDataSubscribe: Subscription = new Subscription();
  updateUserSub: Subscription = new Subscription();

  isWalletCreated: boolean = false;
  isCryptoWalletCreated: boolean = false;
  isAssetCreated: boolean = false;
  isCurrencyAdded: boolean = false;
  wallets?: Wallet[];
  cryptoWallet?: Wallet[];

  currency: string = '';

  private CRYPTO: string = 'Crypto';

  enableModalCrypto: boolean = false;

  marketData: Asset[] = [];

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private shared: SharedService,
    private cryptoService: CryptoService
  ) {}

  ngOnDestroy(): void {
    this.updateUserSub.unsubscribe();
    this.walletsSubscribe.unsubscribe();
    this.marketDataSubscribe.unsubscribe();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    let user = UserService.getUserData();
    let requirements: Array<string> =
      user.attributes.money_stats_settings.completeRequirement?.split(';')!;
    if (
      !Utils.isNullOrEmpty(requirements) &&
      requirements.includes(Status.ASSET)
    )
      this.isAssetCreated = true;
    if (
      !Utils.isNullOrEmpty(requirements) &&
      requirements.includes(Status.CRYPTO_WALLET)
    )
      this.isCryptoWalletCreated = true;
    if (
      !Utils.isNullOrEmpty(requirements) &&
      requirements.includes(Status.WALLET)
    )
      this.isWalletCreated = true;
    if (
      !Utils.isNullOrEmpty(requirements) &&
      requirements.includes(Status.CURRENCY)
    )
      this.isCurrencyAdded = true;

    this.getWallets().then((wal) => {
      this.wallets = wal;
      if (wal != undefined && wal.length != 0) {
        this.isWalletCreated = true;
        this.cryptoWallet = wal.filter(
          (w: Wallet) => w.category == this.CRYPTO
        );
      }
      if (user.attributes.money_stats_settings.cryptoCurrency) {
        this.isCurrencyAdded = true;
        this.currency = user.attributes.money_stats_settings.cryptoCurrency;
      }
    });
    this.getMarketData();

    /*let user = this.dashboardService.user;
    this.wallets = this.dashboardService.dashboard.wallets;
    this.dashboard = this.dashboardService.dashboard;
    if (this.wallets && this.wallets != undefined)
      this.cryptoWallet = this.wallets.filter((w) => w.category == this.CRYPTO);

    if (this.wallets != undefined && this.wallets.length != 0) {
      this.isWalletCreated = true;
      let wallets = this.wallets.filter(
        (wallet) => wallet.category == this.CRYPTO
      );
      if (wallets != undefined && wallets.length != 0) {
        this.isCryptoWalletCreated = true;
        if (wallets.find((w) => w.assets != undefined && w.assets.length != 0))
          this.isAssetCreated = true;
      }
    }
    if (user?.settings.cryptoCurrency) {
      this.isCurrencyAdded = true;
      this.currency = user.settings.cryptoCurrency;
    }*/
    this.goToDashboard();
    //if (this.validateBtn()) this.router.navigate(['/crypto/dashboard']);
  }

  validateBtn(): boolean {
    let validate =
      this.isCryptoWalletCreated &&
      this.isWalletCreated &&
      this.isAssetCreated &&
      this.isCurrencyAdded;
    return validate;
  }

  saveWallet(wallet: Wallet) {
    let user = UserService.getUserData();
    const walletsToSave: Wallet[] = Utils.copyObject(this.wallets);
    if (walletsToSave != undefined) {
      let index = walletsToSave.indexOf(
        walletsToSave.find((w) => w.name == wallet.name)!
      );
      walletsToSave[index!] = wallet!;
      this.isWalletCreated = true;
      this.cryptoWallet = walletsToSave!.filter(
        (w) => w.category == this.CRYPTO
      );
      if (walletsToSave[index!].category == this.CRYPTO) {
        this.isCryptoWalletCreated = true;
      }
      if (
        walletsToSave[index!].assets != undefined &&
        walletsToSave[index!].assets.length != 0
      )
        this.isAssetCreated = true;
    } else if (walletsToSave == undefined && wallet.category == this.CRYPTO) {
      this.isCryptoWalletCreated = true;
      //this.dashboardService.dashboard.wallets = [wallet];
      this.cryptoWallet = [wallet];
      this.wallets = [wallet];
      this.isWalletCreated = true;
    } else {
      //this.dashboardService.dashboard.wallets = [wallet];
      this.wallets = [wallet];
      this.isWalletCreated = true;
    }

    if (this.isWalletCreated)
      user.attributes.money_stats_settings.completeRequirement = user.attributes.money_stats_settings.completeRequirement
        ? user.attributes.money_stats_settings.completeRequirement.concat(Status.WALLET).concat(';')
        : Status.WALLET.concat(';');

    if (this.isCryptoWalletCreated)
      user.attributes.money_stats_settings.completeRequirement = user.attributes.money_stats_settings.completeRequirement
        ? user.attributes.money_stats_settings.completeRequirement
            .concat(Status.CRYPTO_WALLET)
            .concat(';')
        : Status.CRYPTO_WALLET.concat(';');

    if (this.isAssetCreated)
      user.attributes.money_stats_settings.completeRequirement = user.attributes.money_stats_settings.completeRequirement
        ? user.attributes.money_stats_settings.completeRequirement.concat(Status.ASSET).concat(';')
        : Status.ASSET.concat(';');

    this.updateUser(user);
  }

  selectCurrency(user: User) {
    user.attributes.money_stats_settings.completeRequirement = user.attributes.money_stats_settings.completeRequirement
      ? user.attributes.money_stats_settings.completeRequirement.concat(Status.CURRENCY).concat(';')
      : Status.CURRENCY.concat(';');
    this.updateUser(user);
    this.isCurrencyAdded = true;
    this.currency = user.attributes.money_stats_settings.currency;
  }

  updateUser(user: User) {
    if (
      this.isAssetCreated &&
      this.isCryptoWalletCreated &&
      this.isCurrencyAdded &&
      this.isWalletCreated
    )
     user.attributes.money_stats_settings.completeRequirement = Status.COMPLETED;
    this.updateUserSub = this.authService
      .updateUserData(user)
      .subscribe((data) => {
        LOG.info(data.message!, 'RequirementsComponent');
        this.userService.setUserGlobally_old(data.data);
        //this.authService.user = data.data;
        //this.authService.setUserGlobally();
      });
  }

  getWallets(): Promise<any> {
    if (Utils.isNullOrEmpty(this.shared.getWallets())) {
      return new Promise((resolve, reject) => {
        this.walletsSubscribe = this.walletService.getWalletsData().subscribe({
          next: (res) => {
            this.walletService.cache.cacheWalletsData(res);
            LOG.info(res.message!, 'RequirementsComponent');
            this.wallets = this.shared.setWallets(res.data);
            resolve(res.data);
          },
          error: (err) => {
            reject(err); // In caso di errore, rifiuta la Promise
          },
        });
      });
    } else {
      this.wallets = this.shared.getWallets();
      return Promise.resolve(this.shared.getWallets());
    }
  }

  getMarketData() {
    let user = UserService.getUserData();
    this.marketDataSubscribe = this.cryptoService
      .getCryptoPriceData(user.attributes.money_stats_settings.cryptoCurrency!)
      .subscribe((data) => {
        this.marketData = data.data;
        LOG.info(data.message!, 'RequirementsComponent');
        this.cryptoService.cache.cacheMarketDataByCurrencyData(data);
      });
  }

  goToDashboard() {
    if (
      this.isAssetCreated &&
      this.isCryptoWalletCreated &&
      this.isCurrencyAdded &&
      this.isWalletCreated
    )
      this.router.navigate(['/crypto/dashboard']);
  }
}
