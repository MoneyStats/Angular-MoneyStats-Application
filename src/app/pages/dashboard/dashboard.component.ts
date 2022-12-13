import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ErrorService } from 'src/assets/core/interceptors/error.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { SplideService } from 'src/assets/core/utils/splide.service';
import { ToastService } from 'src/assets/core/utils/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output('dashboard') dashboard: Dashboard = new Dashboard();
  @Output('user') user: User = new User();
  @Output('performance') performance: string = this.dashboard.performace + ' %';
  @Output('performanceSince') performanceSince: string =
    this.dashboard.performanceSince.toString();
  @Output('lastStatsPerformance') lastStatsPerformance: string =
    this.dashboard.lastStatsPerformance + ' %';
  @Output('lastStatsPerformance') lastStatsBalanceDifference: string =
    this.dashboard.lastStatsBalanceDifference.toString();
  public chartOptions?: Partial<ChartOptions>;

  constructor(
    private dashboardService: DashboardService,
    public userService: UserService,
    private datePipe: DatePipe,
    private splide: SplideService,
    private charts: ChartService,
    private toast: ToastService,
    private err: ErrorService,
    private screenService: ScreenService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getData().subscribe((data) => {
      this.dashboard = data;
      this.dashboardService.dashboard = data;
      this.performance = this.dashboard.performace + ' %';
      let date = this.datePipe
        .transform(this.dashboard.performanceSince, 'dd MMM y')
        ?.toString();
      this.performanceSince =
        this.dashboard.performanceSince != null
          ? date!
          : this.datePipe.transform(new Date(), 'dd MMM y')!;
      this.lastStatsPerformance = this.dashboard.lastStatsPerformance + ' %';
      this.lastStatsBalanceDifference =
        this.dashboard.lastStatsBalanceDifference +
        ' ' +
        this.userService.coinSymbol;
      this.walletService.totalBalance = data.balance;
      //this.chart.render(data);
      setTimeout(() => {
        this.chartOptions = this.charts.renderChartLine(data);
      }, 100);
    });
    this.splide.activeSplide();
    this.screenService.activeHeaderAndFooter();
    this.screenService.goToDashboard();
  }

  availableSoon() {
    this.toast.availableSoon();
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }

  error() {
    this.err.throwException().subscribe((res) => console.log(res));
  }

  walletFilter(wallets: Wallet[]): Array<Wallet> {
    return wallets.filter((w) => !w.deleted);
  }
}
