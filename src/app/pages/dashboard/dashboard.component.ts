import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ErrorService } from 'src/assets/core/interceptors/error.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
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
    private err: ErrorService
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
      //this.chart.render(data);
      this.chartOptions = this.charts.renderChartLine(data);
    });
    this.splide.activeSplide();
    this.activeHeader();
  }

  availableSoon() {
    this.toast.availableSoon();
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }

  activeHeader() {
    const header = document.getElementById('header');
    header!.style.display = 'flex';
  }
  error() {
    this.err.throwException().subscribe((res) => console.log(res));
  }
}
