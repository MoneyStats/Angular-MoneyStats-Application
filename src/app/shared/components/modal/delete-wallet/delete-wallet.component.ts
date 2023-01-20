import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/modal.constant';
import { WalletService } from 'src/assets/core/services/wallet.service';

@Component({
  selector: 'app-delete-wallet',
  templateUrl: './delete-wallet.component.html',
  styleUrls: ['./delete-wallet.component.scss'],
})
export class DeleteWalletComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('wallet') wallet?: Wallet;

  constructor(private route: Router, private walletService: WalletService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  deleteWallet(wallet: Wallet) {
    if (!wallet.deletedDate) {
      wallet.deletedDate = new Date();
      this.walletService.addUpdateWallet(wallet).subscribe((data) => {
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
    this.walletService.addUpdateWallet(wallet).subscribe((data) => {
      this.wallet = data.data;
      wallet = data.data;
    });
  }
}
