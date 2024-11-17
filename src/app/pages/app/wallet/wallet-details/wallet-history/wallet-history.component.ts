import { Component, OnInit } from '@angular/core';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { StorageConstant } from 'src/assets/core/data/constant/constant';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wallet-history',
  templateUrl: './wallet-history.component.html',
  styleUrls: ['./wallet-history.component.scss'],
})
export class WalletHistoryComponent implements OnInit {
  environment = environment;
  wallet?: Wallet;
  walletMap?: Map<string, Stats[]> = new Map<string, Stats[]>();
  uniqueYears: any;

  amount: string = '******';
  hidden: boolean = false;
  constructor(
    public screenService: ScreenService,
    private shared: SharedService
  ) {}

  screenWidth() {
    return ScreenService.screenWidth;
  }

  ngOnInit(): void {
    this.wallet = this.shared.getWallet();

    if (this.wallet?.history.find((w) => w.id == undefined)) {
      let index = this.wallet.history.indexOf(
        this.wallet?.history.find((w) => w.id == undefined)!
      );
      this.wallet.history.splice(index, 1);
    }
    let years: Array<string> = [];
    this.wallet?.history.forEach((histor) => {
      years.push(histor.date.toString().split('-')[0]);
    });
    this.uniqueYears = [...new Set(years)];
    this.uniqueYears.forEach((year: string) => {
      this.walletMap?.set(
        year,
        this.wallet!.history.filter((h) => h.date.toString().includes(year))
      );
    });
    this.isWalletBalanceHidden();
  }

  isWalletBalanceHidden() {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }
}
