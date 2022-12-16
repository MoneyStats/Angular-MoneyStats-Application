import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/modal.constant';

@Component({
  selector: 'app-delete-wallet',
  templateUrl: './delete-wallet.component.html',
  styleUrls: ['./delete-wallet.component.scss'],
})
export class DeleteWalletComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('wallet') wallet?: Wallet;

  constructor(private route: Router) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  deleteWallet(wallet: Wallet) {
    if (!wallet.deleted) {
      wallet.deleted = new Date().toLocaleDateString();
    } else {
      this.route.navigateByUrl('');
    }
  }

  restoreWallet(wallet: Wallet) {
    wallet.deleted = undefined;
  }
}
