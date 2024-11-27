import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeSlider } from 'src/app/shared/animations/route-animations';
import { Status, User } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { AppService } from 'src/assets/core/services/api/app.service';
import { environment } from 'src/environments/environment';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { UserService } from 'src/assets/core/services/api/user.service';

@Component({
    selector: 'app-crypto',
    templateUrl: './crypto.component.html',
    styleUrls: ['./crypto.component.scss'],
    animations: [fadeSlider],
    standalone: false
})
export class CryptoComponent implements OnInit, OnDestroy {
  cryptoDashboardSub: Subscription = new Subscription();

  environment = environment;
  isFooterActive: boolean = false;
  user?: User;
  constructor(
    private router: Router,
    private appService: AppService,
    private contexts: ChildrenOutletContexts
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
    this.user = UserService.getUserData();
    if (this.user.name === 'DEFAULT_NAME') {
      this.user = AuthService.getUserFromStorage();
    }
    if (!this.user.settings.completeRequirement?.match(Status.COMPLETED)) {
      this.onBoard();
    }
    /*this.cryptoDashboardSub = this.cryptoService
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
      });*/
  }

  onBoard() {
    if (!this.appService.isOnboardingCrypto) {
      this.appService.isOnboardingCrypto = true;
      this.router.navigate(['on-boarding']);
    } else this.router.navigate(['crypto/requirements']);
  }

  vibrate() {
    this.user = UserService.getUserData();
    Utils.vibrate();
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
