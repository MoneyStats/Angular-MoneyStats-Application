import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { UserService } from 'src/assets/core/services/api/user.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  standalone: false,
})
export class TransactionDetailsComponent implements OnInit {
  @Input('wallet') wallet?: Wallet;
  @Input('class') class?: string;
  coinSymbol: string = UserService.getUserData().settings.currencySymbol;
  constructor(
    public screenService: ScreenService,
    private shared: SharedService
  ) {}

  isMobile() {
    return ScreenService.isMobileDevice();
  }

  ngOnInit(): void {
    ScreenService.setupHeader();
    ScreenService.hideFooter();
    this.wallet = this.shared.getWallet();

    if (this.wallet?.history.find((w) => w.id == undefined)) {
      let index = this.wallet.history.indexOf(
        this.wallet?.history.find((w) => w.id == undefined)!
      );
      this.wallet.history.splice(index, 1);
    }

    this.class =
      this.wallet?.differenceLastStats === 0
        ? 'text-warning'
        : this.wallet!.differenceLastStats > 0
        ? 'text-success'
        : 'text-danger';
  }
}
