import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/assets/core/services/app.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss'],
})
export class CryptoComponent implements OnInit {
  constructor(
    private router: Router,
    private appService: AppService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    let dashboard = this.dashboardService.dashboard;

    if (dashboard.wallets != undefined && dashboard.wallets.length != 0) {
      let wallets = this.dashboardService.dashboard.wallets.filter(
        (wallet) => wallet.category == 'CRYPTO'
      );
      if (wallets == undefined || wallets.length == 0) {
        this.onBoard();
      }
    } else this.onBoard();
  }

  onBoard() {
    if (!this.appService.isOnboardingCrypto) {
      this.appService.isOnboardingCrypto = true;
      this.router.navigate(['on-boarding']);
    } //else this.router.navigate(['crypto/requirements']);
  }
}
