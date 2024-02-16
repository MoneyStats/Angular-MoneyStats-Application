import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeSlider } from 'src/app/shared/animations/route-animations';
import { CryptoDashboard } from 'src/assets/core/data/class/crypto.class';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { AppService } from 'src/assets/core/services/app.service';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from '../app/dashboard/dashboard.component';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss'],
  animations: [fadeSlider],
})
export class CryptoComponent implements OnInit, OnDestroy {
  cryptoDashboardSub: Subscription = new Subscription();

  environment = environment;
  isFooterActive: boolean = false;
  user?: User;
  constructor(
    private router: Router,
    private appService: AppService,
    private cryptoService: CryptoService,
    private contexts: ChildrenOutletContexts,
    private dashboardService: DashboardService
  ) {
    router.events.subscribe((data: any) => {
      let url: string = data.url;
      if (
        url &&
        (url == '/crypto/requirements' || url.includes('/crypto/asset/details'))
      ) {
        this.isFooterActive = false;
      } else this.isFooterActive = true;
    });
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.cryptoDashboardSub.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this.appService.user;
    this.cryptoDashboardSub = this.cryptoService
      .getCryptoDashboardData()
      .subscribe((data) => {
        this.cryptoService.cache.cacheCryptoDashboardData(data);
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
    /*let dashboard = this.dashboardService.dashboard;

    if (dashboard.wallets != undefined && dashboard.wallets.length != 0) {
      let wallets = dashboard.wallets.filter(
        (wallet: Wallet) => wallet.category == 'Crypto'
      );
      if (
        wallets == undefined ||
        wallets.length == 0 ||
        !wallets.find((w: any) => w.assets != undefined)
      ) {
        this.onBoard();
      }
    } else this.onBoard();*/
  }

  onBoard() {
    if (!this.appService.isOnboardingCrypto) {
      this.appService.isOnboardingCrypto = true;
      this.router.navigate(['on-boarding']);
    } else this.router.navigate(['crypto/requirements']);
  }

  vibrate() {
    this.user = this.appService.user;
    this.appService.vibrate();
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
