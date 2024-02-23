import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { Status, User } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { LoggerService } from 'src/assets/core/utils/log.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
})
export class RequirementsComponent implements OnInit, OnDestroy {
  updateUserSub: Subscription = new Subscription();

  isWalletCreated: boolean = false;
  isCryptoWalletCreated: boolean = false;
  isAssetCreated: boolean = false;
  isCurrencyAdded: boolean = false;
  dashboard?: Dashboard;
  wallets?: Wallet[];
  cryptoWallet?: Wallet[];

  currency: string = '';

  private CRYPTO: string = 'Crypto';

  enableModalCrypto: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnDestroy(): void {
    this.updateUserSub.unsubscribe();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    let user = this.userService.user;
    let requirements: Array<string> =
      user.settings.completeRequirement?.split(';')!;
    if (requirements.includes(Status.ASSET)) this.isAssetCreated = true;
    if (requirements.includes(Status.CRYPTO_WALLET))
      this.isCryptoWalletCreated = true;
    if (requirements.includes(Status.WALLET)) this.isWalletCreated = true;
    if (requirements.includes(Status.CURRENCY)) this.isCurrencyAdded = true;

    this.wallets = this.dashboardService.dashboard.wallets;
    if (this.wallets != undefined && this.wallets.length != 0) {
      this.isWalletCreated = true;
    }
    if (user.settings.cryptoCurrency) {
      this.isCurrencyAdded = true;
      this.currency = user.settings.cryptoCurrency;
    }
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
    let user = this.userService.user;
    if (this.wallets != undefined) {
      let index = this.wallets?.indexOf(
        this.wallets.find((w) => w.name == wallet.name)!
      );
      this.wallets![index!] = wallet!;
      this.isWalletCreated = true;
      this.cryptoWallet = this.wallets!.filter(
        (w) => w.category == this.CRYPTO
      );
      if (this.wallets![index!].category == this.CRYPTO) {
        this.isCryptoWalletCreated = true;
      }
      if (
        this.wallets![index!].assets != undefined &&
        this.wallets![index!].assets.length != 0
      )
        this.isAssetCreated = true;
    } else if (this.wallets == undefined && wallet.category == this.CRYPTO) {
      this.isCryptoWalletCreated = true;
      this.dashboardService.dashboard.wallets = [wallet];
      this.cryptoWallet = [wallet];
      this.wallets = [wallet];
      this.isWalletCreated = true;
    } else {
      this.dashboardService.dashboard.wallets = [wallet];
      this.wallets = [wallet];
      this.isWalletCreated = true;
    }

    if (this.isWalletCreated)
      user.settings.completeRequirement = user.settings.completeRequirement
        ? user.settings.completeRequirement.concat(Status.WALLET).concat(';')
        : Status.WALLET.concat(';');

    if (this.isCryptoWalletCreated)
      user.settings.completeRequirement = user.settings.completeRequirement
        ? user.settings.completeRequirement
            .concat(Status.CRYPTO_WALLET)
            .concat(';')
        : Status.CRYPTO_WALLET.concat(';');

    if (this.isAssetCreated)
      user.settings.completeRequirement = user.settings.completeRequirement
        ? user.settings.completeRequirement.concat(Status.ASSET).concat(';')
        : Status.ASSET.concat(';');

    this.updateUser(user);
  }

  selectCurrency(user: User) {
    user.settings.completeRequirement = user.settings.completeRequirement
      ? user.settings.completeRequirement.concat(Status.CURRENCY).concat(';')
      : Status.CURRENCY.concat(';');
    this.updateUser(user);
    this.isCurrencyAdded = true;
    this.currency = user.settings.currency;
  }

  updateUser(user: User) {
    if (
      this.isAssetCreated &&
      this.isCryptoWalletCreated &&
      this.isCurrencyAdded &&
      this.isWalletCreated
    )
      user.settings.completeRequirement = Status.COMPLETED;
    this.updateUserSub = this.userService
      .updateUserData(user)
      .subscribe((data) => {
        this.logger.LOG(data.message!, 'RequirementsComponent');
        this.userService.user = data.data;
        this.userService.setUserGlobally();
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
