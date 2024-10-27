import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { WalletService } from 'src/assets/core/services/api/wallet.service';
import { LOG } from 'src/assets/core/utils/log.service';

@Component({
  selector: 'app-delete-wallet',
  templateUrl: './delete-wallet.component.html',
  styleUrls: ['./delete-wallet.component.scss'],
})
export class DeleteWalletComponent implements OnDestroy {
  deleteWalletSub: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  @Input('wallet') wallet?: Wallet;

  constructor(private route: Router, private walletService: WalletService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.deleteWalletSub.unsubscribe();
  }

  deleteWallet(wallet: Wallet) {
    if (!wallet.deletedDate) {
      wallet.deletedDate = new Date();
      this.deleteWalletSub = this.walletService
        .addOrUpdateWalletsData(wallet)
        .subscribe((data) => {
          this.wallet = data.data;
          wallet = data.data;
        });
    } else {
      // TODO: Delete Wallet
      this.route.navigateByUrl('');
    }
  }

  restoreWallet(wallet: Wallet) {
    wallet.deletedDate = undefined;
    this.walletService.addOrUpdateWalletsData(wallet).subscribe((data) => {
      LOG.info(data.message!, 'DeleteWalletComponent');
      this.wallet = data.data;
      wallet = data.data;
    });
  }
}
