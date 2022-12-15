import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { SplideService } from 'src/assets/core/utils/splide.service';

@Component({
  selector: 'app-splide-slide',
  templateUrl: './splide-slide.component.html',
  styleUrls: ['./splide-slide.component.scss'],
})
export class SplideSlideComponent implements OnInit {
  @Input('wallet') wallet?: Wallet;
  @Input('btn') btn?: string;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    //this.splide.activeSplide();
  }

  walletDetails() {
    this.walletService.walletDetails.push(this.wallet!);
  }
}
