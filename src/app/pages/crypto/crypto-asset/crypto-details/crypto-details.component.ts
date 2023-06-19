import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.scss'],
})
export class CryptoDetailsComponent implements OnInit {
  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  @Output() asset: Asset = new Asset();

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private screenService: ScreenService
  ) {}

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.cryptoDashboard = this.cryptoService.cryptoDashboard;
    let assets = this.cryptoService.assets;
    console.log(assets, this.cryptoDashboard);
    this.route.params.subscribe((a: any) => {
      if (assets.length != 0) {
        this.asset = assets.find((as) => as.identifier == a.identifier)!;
      } else {
        this.cryptoService
          .getCryptoDetails(a.identifier)
          .subscribe((details) => {
            this.asset = details.data;
            this.cryptoService.asset = details.data;
          });
      }
    });
  }
}
