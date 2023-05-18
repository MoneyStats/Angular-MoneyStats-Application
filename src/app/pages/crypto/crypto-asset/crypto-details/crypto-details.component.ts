import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.scss'],
})
export class CryptoDetailsComponent implements OnInit {
  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  asset: Asset = new Asset();

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.cryptoDashboard = this.cryptoService.cryptoDashboard;
    let assets = this.cryptoDashboard.assets;
    this.route.params.subscribe((a: any) => {
      this.asset = assets.find((as) => as.identifier == a.identifier)!;
    });
  }
}
