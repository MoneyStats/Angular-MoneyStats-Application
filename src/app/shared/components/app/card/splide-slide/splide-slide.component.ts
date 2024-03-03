import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { WalletService } from 'src/assets/core/services/api/wallet.service';

@Component({
  selector: 'app-splide-slide',
  templateUrl: './splide-slide.component.html',
  styleUrls: ['./splide-slide.component.scss'],
})
export class SplideSlideComponent {
  @Input('wallet') wallet?: Wallet;
  @Input('btn') btn?: string;

  constructor(private walletService: WalletService) {}

  walletDetails() {
    this.walletService.walletDetails.push(this.wallet!);
  }
}
