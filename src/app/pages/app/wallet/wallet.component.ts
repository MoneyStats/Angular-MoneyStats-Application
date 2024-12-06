import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { UserService } from 'src/assets/core/services/api/user.service';
import { WalletService } from 'src/assets/core/services/api/wallet.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  standalone: false,
})
export class WalletComponent implements OnInit, OnDestroy {
  walletsSubscribe: Subscription = new Subscription();

  wallets: Wallet[] = [];
  amount: string = '******';
  hidden: boolean = false;

  coinSymbol: string = UserService.getUserData().settings.currencySymbol;

  walletsActive: Wallet[] = [];
  walletsDeleted: Wallet[] = [];

  constructor(
    private walletService: WalletService,
    public screenService: ScreenService,
    private shared: SharedService
  ) {}

  ngOnDestroy(): void {
    this.walletsSubscribe.unsubscribe();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  isMobile() {
    return ScreenService.isMobileDevice();
  }

  ngOnInit(): void {
    ScreenService.setupHeader();
    ScreenService.goToWallet();
    ScreenService.showFooter();
    this.walletsSubscribe = this.walletService
      .getWalletsData()
      .subscribe((res) => {
        this.walletService.cache.cacheWalletsData(res);
        LOG.info(res.message!, 'WalletComponent');
        this.wallets = res.data;
        this.shared.setWallets(this.wallets);
        this.walletsActive = this.walletActive(res.data);
        this.walletsDeleted = this.walletDeleted(res.data);
        let isHidden = JSON.parse(
          localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
        );
        if (isHidden != null) {
          this.hidden = isHidden;
        }
      });
  }

  walletActive(wallets: Wallet[]): Array<Wallet> {
    if (wallets) return wallets.filter((w) => !w.deletedDate);
    else return [];
  }

  walletDeleted(wallets: Wallet[]): Array<Wallet> {
    if (wallets) return wallets.filter((w) => w.deletedDate);
    else return [];
  }

  addWallet(wallet: Wallet) {
    this.wallets.push(wallet);
  }
}
