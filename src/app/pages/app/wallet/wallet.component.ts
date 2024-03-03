import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { WalletService } from 'src/assets/core/services/api/wallet.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
  walletsSubscribe: Subscription = new Subscription();

  wallets: Wallet[] = [];
  amount: string = '******';
  hidden: boolean = false;

  constructor(
    public walletService: WalletService,
    public screenService: ScreenService
  ) {}

  ngOnDestroy(): void {
    this.walletsSubscribe.unsubscribe();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  screenWidth() {
    return ScreenService.screenWidth;
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
        this.walletService.walletActive = this.walletActive(res.data);
        this.walletService.walletDeleted = this.walletDeleted(res.data);
        this.walletDetails(res.data);
        let isHidden = JSON.parse(
          localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
        );
        if (isHidden != null) {
          this.hidden = isHidden;
        }
      });
  }

  walletActive(wallets: Wallet[]): Array<Wallet> {
    return wallets.filter((w) => !w.deletedDate);
  }

  walletDeleted(wallets: Wallet[]): Array<Wallet> {
    return wallets.filter((w) => w.deletedDate);
  }

  walletDetails(res: Wallet[]) {
    this.walletService.walletDetails = res;
  }

  addWallet(wallet: Wallet) {
    this.wallets.push(wallet);
  }
}
