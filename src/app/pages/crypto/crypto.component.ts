import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { fadeSlider } from 'src/app/shared/animations/route-animations';
import { CryptoDashboard } from 'src/assets/core/data/class/crypto.class';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { AppService } from 'src/assets/core/services/app.service';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss'],
  animations: [fadeSlider],
})
export class CryptoComponent implements OnInit {
  environment = environment;
  isFooterActive: boolean = false;
  constructor(
    private router: Router,
    private appService: AppService,
    private cryptoService: CryptoService,
    private contexts: ChildrenOutletContexts
  ) {
    router.events.subscribe((data: any) => {
      if (data.url == '/crypto/requirements') {
        this.isFooterActive = false;
      } else this.isFooterActive = true;
    });
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.cryptoService.getCryptoDashboard().subscribe((data) => {
      let dashboard = data.data;

      if (dashboard.wallets != undefined && dashboard.wallets.length != 0) {
        let wallets = dashboard.wallets.filter(
          (wallet: Wallet) => wallet.category == 'Crypto'
        );
        if (
          wallets == undefined ||
          wallets.length == 0 ||
          //wallets[0].assets == undefined ||
          //wallets[0].assets.length == 0
          !wallets.find((w: any) => w.assets != undefined)
        ) {
          this.onBoard();
        }
      } else this.onBoard();
    });
  }

  onBoard() {
    if (!this.appService.isOnboardingCrypto) {
      this.appService.isOnboardingCrypto = true;
      this.router.navigate(['on-boarding']);
    } else this.router.navigate(['crypto/requirements']);
  }

  vibrate() {
    this.appService.vibrate();
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
