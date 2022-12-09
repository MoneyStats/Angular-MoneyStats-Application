import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss'],
})
export class WalletCardComponent implements OnInit {
  @Input('walletImg') walletImg?: string;
  @Input('walletName') walletName?: string;
  @Input('category') category?: string;
  @Input('btn') btn?: string;
  constructor() {}

  ngOnInit(): void {}
}
