import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { v4 as uuidv4 } from 'uuid';
import { StatsService } from 'src/assets/core/services/api/stats.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: false,
})
export class StatsComponent implements OnInit, OnDestroy {
  resumeSubscribe: Subscription = new Subscription();
  historySubscribe: Subscription = new Subscription();
  coinSymbol: string =
    UserService.getUserData().attributes.money_stats_settings.currencySymbol;

  wallets: Wallet[] = [];
  resumeData: Dashboard = new Dashboard();
  resume: Map<string, Dashboard> = new Map<string, Dashboard>();
  resumeFullYears: Array<string> = [];
  currentYear = new Date().getFullYear();

  historyData: Map<string, Dashboard> = new Map<string, Dashboard>();

  amount: string = '******';
  hidden: boolean = false;

  change: string = '';

  @Output('dashboardData') dashboardData: Dashboard = new Dashboard();
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

  isMobile() {
    return ScreenService.isMobileDevice();
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

        if (UserService.getUserData().mockedUser) {
          const keys = Array.from(this.resume.keys());
          const firstKey = keys.length > 0 ? keys[0] : undefined;
          year = Number.parseInt(firstKey!);
        }

        this.resumeFullYears = [];
        // Ottieni l'array di anni senza duplicati e in ordine decrescente
        const uniqueYears = Array.from(
          new Set(this.resume.get(year.toString())?.yearsWalletStats ?? [])
        ).sort((a, b) => a - b);

        // Aggiungi gli anni ordinati in ordine decrescente all'array resumeFullYears
        uniqueYears.forEach((y) => {
          this.resumeFullYears.push(y.toString());
        });

        //this.resumeFullYears = this.mapYears(this.resume, year);
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
    this.dashboardData = Utils.copyObject(this.resumeData);
    if (this.resumeData.statsWalletDays)
      this.resumeData.statsWalletDays = this.resumeData.statsWalletDays.filter(
        (date) => new Date(date).getFullYear().toString() === year
      );
    if (
      this.resumeData.hasMoreRecords &&
      Utils.isNullOrEmpty(this.resumeData.statsWalletDays)
    ) {
      this.getResumeData(this.resumeData.yearsWalletStats[0]);
      return;
    }

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

  goToData() {
    this.change = uuidv4();
  }
}
