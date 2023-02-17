import { DatePipe } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { SplideService } from 'src/assets/core/utils/splide.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
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

  constructor(
    private dashboardService: DashboardService,
    public userService: UserService,
    private datePipe: DatePipe,
    private splide: SplideService,
    private charts: ChartService,
    private toast: ToastService,
    public screenService: ScreenService,
    private walletService: WalletService,
    private translate: TranslateService,
    private router: Router
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.dashboardService.getData().subscribe((data) => {
      if (!data.data.balance) {
        this.dashboard.categories = data.data.categories;
        this.dashboard.wallets = data.data.wallets;
        if (!this.dashboardService.isOnboarding) {
          this.router.navigate(['on-boarding']);
          this.dashboardService.isOnboarding = true;
        }
      } else {
        this.dashboard = data.data;
      }
      this.dashboardService.dashboard = this.dashboard;
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
        this.userService.coinSymbol;
      this.walletService.totalBalance = this.dashboard.balance;
      //this.chart.render(data);
      setTimeout(() => {
        if (this.dashboard.wallets) {
          this.chartOptions = this.charts.renderChartLine(this.dashboard);
        }
      }, 100);
    });
    setTimeout(() => {
      this.splide.activeSplide();
    }, 100);

    this.screenService.activeHeaderAndFooter();
    this.screenService.goToDashboard();
  }

  availableSoon() {
    this.toast.availableSoon();
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
  }
}
