import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  wallets: Wallet[] = [];

  constructor(
    public walletService: WalletService,
    public screenService: ScreenService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.goToWallet();
    this.walletService.getWallet().subscribe((res) => {
      this.wallets = res.data;
      this.walletService.walletActive = this.walletActive(res.data);
      this.walletService.walletDeleted = this.walletDeleted(res.data);
      this.walletDetails(res.data);
      console.log(this.wallets);
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
