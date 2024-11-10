import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { StatsService } from 'src/assets/core/services/api/stats.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnDestroy {
  resumeSubscribe: Subscription = new Subscription();
  historySubscribe: Subscription = new Subscription();
  coinSymbol: string = UserService.getUserData().settings.currencySymbol;

  wallets: Wallet[] = [];
  resumeData: Dashboard = new Dashboard();
  resume: Map<string, Dashboard> = new Map<string, Dashboard>();
  resumeFullYears: Array<string> = [];
  currentYear = new Date().getFullYear();

  historyData: Map<string, Dashboard> = new Map<string, Dashboard>();

  amount: string = '******';
  hidden: boolean = false;
  constructor(
    public screenService: ScreenService,
    private statsService: StatsService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.resumeSubscribe.unsubscribe();
  }

  screenWidth() {
    return ScreenService.screenWidth;
  }

  ngOnInit(): void {
    ScreenService.setupHeader();
    ScreenService.showFooter();
    ScreenService.goToStats();
    this.getResumeData(this.currentYear);
    //this.resumeData = this.dashboardService.dashboard;
  }

  getResumeData(year: number) {
    this.resumeSubscribe = this.statsService
      .getResumeData(year)
      .subscribe((res) => {
        this.statsService.cache.cacheResumeData(res, year);
        LOG.info(res.message!, 'StatsComponent');
        this.resume = new Map<string, Dashboard>(Object.entries(res.data));

        this.resumeFullYears = this.mapYears(this.resume, year);
        //this.updateData(this.years[this.years.length - 1]);
        this.updateData(year.toString());
      });
  }

  getHistoryData() {
    if (Utils.isNullOrEmpty(this.historyData))
      this.historySubscribe = this.statsService
        .getHistoryData()
        .subscribe((res) => {
          this.statsService.cache.cacheHistoryData(res);
          LOG.info(res.message!, 'StatsComponent');
          this.historyData = new Map<string, Dashboard>(
            Object.entries(res.data)
          );
        });
  }

  onChange(e: any) {
    this.getResumeData(e.target.value);
  }

  updateData(year: string) {
    this.resumeData = this.resume.get(year)!;
    this.resumeData.statsWalletDays = this.resumeData.statsWalletDays.filter(
      (date) => new Date(date).getFullYear().toString() === year
    );
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

  mapYears(resume: any, year: number): Array<string> {
    const data = resume.get(year.toString());
    const fullData: Array<string> = data.statsWalletDays;

    // Estraggo gli anni dalle date, aggiungo l'anno passato come parametro, elimino i duplicati e ordino in ordine crescente
    const years = Array.from(
      new Set([
        ...fullData.map((date) => new Date(date).getFullYear().toString()),
        year.toString(),
      ])
    ).sort((a, b) => parseInt(a) - parseInt(b));

    return years;
  }
}
