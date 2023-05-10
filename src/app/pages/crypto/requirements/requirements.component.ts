import { Component, OnInit } from '@angular/core';
import { Dashboard } from 'dist/angular-moneystats/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
})
export class RequirementsComponent implements OnInit {
  isWalletCreated: boolean = false;
  isCryptoWalletCreated: boolean = false;
  dashboard?: Dashboard;

  enableModalCrypto: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.dashboard = this.dashboardService.dashboard;

    if (
      this.dashboard.wallets != undefined &&
      this.dashboard.wallets.length != 0
    ) {
      this.isWalletCreated = true;
      let wallets = this.dashboardService.dashboard.wallets.filter(
        (wallet) => wallet.category == 'CRYPTO'
      );
      if (wallets != undefined && wallets.length != 0) {
        this.isCryptoWalletCreated = true;
      }
    }
  }

  validateBtn(): boolean {
    let validate = this.isCryptoWalletCreated && this.isWalletCreated;
    return validate;
  }
}
