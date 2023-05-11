import { Component, OnInit } from '@angular/core';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
})
export class RequirementsComponent implements OnInit {
  isWalletCreated: boolean = false;
  isCryptoWalletCreated: boolean = false;
  isAssetCreated: boolean = false;
  dashboard?: Dashboard;
  wallets?: Wallet[];
  cryptoWallet?: Wallet[];

  enableModalCrypto: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.wallets = this.dashboardService.dashboard.wallets;
    this.dashboard = this.dashboardService.dashboard;
    this.cryptoWallet = this.wallets.filter((w) => w.category == 'Crypto');

    if (this.wallets != undefined && this.wallets.length != 0) {
      this.isWalletCreated = true;
      let wallets = this.wallets.filter(
        (wallet) => wallet.category == 'Crypto'
      );
      if (wallets != undefined && wallets.length != 0) {
        this.isCryptoWalletCreated = true;
        if (wallets.find((w) => w.assets != undefined && w.assets.length != 0))
          this.isAssetCreated = true;
      }
    }
  }

  validateBtn(): boolean {
    let validate =
      this.isCryptoWalletCreated && this.isWalletCreated && this.isAssetCreated;
    return validate;
  }

  saveWallet(wallet: Wallet) {
    let index = this.wallets?.indexOf(
      this.wallets.find((w) => w.name == wallet.name)!
    );
    this.wallets![index!] = wallet!;
    this.cryptoWallet = this.wallets!.filter((w) => w.category == 'Crypto');
    this.isWalletCreated = true;
    if (this.wallets![index!].category == 'Crypto') {
      this.isCryptoWalletCreated = true;
    }
    if (
      this.wallets![index!].assets != undefined &&
      this.wallets![index!].assets.length != 0
    )
      this.isAssetCreated = true;
  }
}
