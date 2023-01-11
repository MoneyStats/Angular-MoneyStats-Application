import { Component, OnInit, Output } from '@angular/core';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/modal.constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { StatsService } from 'src/assets/core/services/stats.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { CategoryComponent } from './category/category.component';
import { DataComponent } from './data/data.component';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  wallets: Wallet[] = [];
  resumeData: Dashboard = new Dashboard();
  resume: Map<string, Dashboard> = new Map<string, Dashboard>();
  years: Array<string> = [];
  constructor(
    public screenService: ScreenService,
    private walletService: WalletService,
    public dashboardService: DashboardService,
    private statsService: StatsService,
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.goToStats();
    this.statsService.getResume().subscribe((res: any) => {
      this.resume = new Map<string, Dashboard>(Object.entries(res));
      this.years = Array.from(this.resume.keys());
      this.updateData(this.years[this.years.length - 1]);
    });
    this.resumeData = this.dashboardService.dashboard;
  }

  onChange(e: any) {
    this.updateData(e.target.value);
  }

  updateData(year: string) {
    this.resumeData = this.resume.get(year)!;
    this.wallets = this.resumeData.wallets;
  }
}
