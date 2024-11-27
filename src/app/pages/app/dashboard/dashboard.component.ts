import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardSubscribe: Subscription = new Subscription();
  environment = environment;
  @Output('dashboard') dashboard: Dashboard = new Dashboard();
  @Output('user') user: User = new User();
  @Output('performance') performance: string =
    this.dashboard.performance + ' %';
  @Output('performanceSince') performanceSince: string =
    this.dashboard.performanceSince.toString();
  @Output('performanceLastDate') performanceLastDate: string =
    this.dashboard.performanceLastDate.toString();
  @Output('lastStatsPerformance') lastStatsPerformance: string =
    this.dashboard.lastStatsPerformance + ' %';
  @Output('lastStatsPerformance') lastStatsBalanceDifference: string =
    this.dashboard.lastStatsBalanceDifference.toString();
  @Output('graphTitle') graphTitle: string = '';
  public chartOptions?: Partial<ApexOptions>;
  @ViewChild('content') content: any;

  @Output() hidden?: boolean;
  amount: string = '******';

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private router: Router,
    private shared: SharedService
  ) {}

  ngOnDestroy(): void {
    this.dashboardSubscribe.unsubscribe();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.user = UserService.getUserData();
    this.dashboardSubscribe = this.dashboardService
      .getDashboardData()
      .subscribe((data) => {
        this.dashboardService.cache.cacheDashboardData(data);
        LOG.info(data.message!, 'DashboardComponent');
        this.shared.setDashboard(data.data);
        if (!data.data.balance) {
          //this.dashboard.categories = data.data.categories;
          this.dashboard.wallets = data.data.wallets;

          if (!this.dashboardService.isOnboarding) {
            this.router.navigate(['on-boarding']);
            this.dashboardService.isOnboarding = true;
            return;
          }
        } else {
          if (!this.dashboardService.isOnboarding && this.user.mockedUser) {
            this.router.navigate(['on-boarding']);
            this.dashboardService.isOnboarding = true;
            return;
          }
          this.dashboard = data.data;
        }
        if (this.dashboard.wallets && this.dashboard.wallets.length) {
          this.scrollX();
        } else {
          const slider = document.getElementById('slider');
          slider!.style.display = 'none';
        }
        this.performance = this.dashboard.performance + ' %';
        let date = this.datePipe
          .transform(this.dashboard.performanceSince, 'dd MMM y')
          ?.toString();
        this.performanceSince =
          this.dashboard.performanceSince != null
            ? date!
            : this.datePipe.transform(new Date(), 'dd MMM y')!;
        let datelastStats = this.datePipe
          .transform(this.dashboard.performanceLastDate, 'dd MMM y')
          ?.toString();
        this.performanceLastDate =
          this.dashboard.performanceLastDate != null
            ? datelastStats!
            : this.datePipe.transform(new Date(), 'dd MMM y')!;
        this.graphTitle =
          this.performanceSince != this.performanceLastDate
            ? this.translate
                .instant('dashboard.graph.title')
                .replace('&FROM&', this.performanceSince)
                .replace('&TO&', this.performanceLastDate)
            : this.translate
                .instant('dashboard.graph.titleFirst')
                .replace('&FROM&', this.performanceSince);
        this.lastStatsPerformance = this.dashboard.lastStatsPerformance + ' %';
        this.lastStatsBalanceDifference =
          this.dashboard.lastStatsBalanceDifference +
          ' ' +
          this.user.settings.currencySymbol;
        this.renderChart(this.dashboard);
      });

    this.isWalletBalanceHidden();
    ScreenService.activeHeaderAndFooter();
    ScreenService.goToDashboard();
  }

  renderChart(dashboard: Dashboard) {
    let dashboardRender = Utils.copyObject(dashboard);
    setTimeout(() => {
      if (this.dashboard.wallets) {
        this.chartOptions =
          ChartService.appRenderWalletPerformance(dashboardRender);
      }
    }, 500);
  }

  availableSoon() {
    ToastService.availableSoon();
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }

  walletFilter(wallets: Wallet[]): Array<Wallet> {
    if (wallets) {
      return wallets.filter((w) => !w.deletedDate);
    } else {
      return [];
    }
  }

  addWallet(wallet: Wallet) {
    if (this.dashboard.wallets) {
      this.dashboard.wallets.push(wallet);
    } else {
      this.dashboard.wallets = [wallet];
    }
    const slider = document.getElementById('slider');
    slider!.style.display = 'flex';
    this.scrollX();
  }

  scrollX() {
    const scrollContainer = document.getElementById('slider')!;

    scrollContainer.addEventListener('wheel', (evt) => {
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY * 2;
    });
  }

  changeAmountStatus(hidden: boolean) {
    this.hidden = hidden;
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
