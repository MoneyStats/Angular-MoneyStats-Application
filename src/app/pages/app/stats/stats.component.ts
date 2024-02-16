import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { StatsService } from 'src/assets/core/services/stats.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnDestroy {
  resumeSubscribe: Subscription = new Subscription();

  wallets: Wallet[] = [];
  resumeData: Dashboard = new Dashboard();
  resume: Map<string, Dashboard> = new Map<string, Dashboard>();
  years: Array<string> = [];

  amount: string = '******';
  hidden: boolean = false;
  constructor(
    public screenService: ScreenService,
    public dashboardService: DashboardService,
    private statsService: StatsService,
    private logger: LoggerService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.resumeSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.showFooter();
    this.screenService.goToStats();
    this.resumeSubscribe = this.statsService
      .getResumeData()
      .subscribe((res) => {
        this.statsService.cache.cacheResumeData(res);
        this.logger.LOG(res.message!, 'StatsComponent');
        this.resume = new Map<string, Dashboard>(Object.entries(res.data));
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
    this.isWalletBalanceHidden();
  }

  isWalletBalanceHidden() {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }
}
