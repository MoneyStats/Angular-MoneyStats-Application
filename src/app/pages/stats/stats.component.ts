import { Component, OnInit } from '@angular/core';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/modal.constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  wallets: Wallet[] = [];
  dashboard: Dashboard = new Dashboard();
  constructor(
    public screenService: ScreenService,
    private walletService: WalletService,
    private dashboardService: DashboardService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.goToStats();
    this.walletService.getWallet().subscribe((res) => {
      this.wallets = res;
    });
    this.dashboard = this.dashboardService.dashboard;
  }
}
