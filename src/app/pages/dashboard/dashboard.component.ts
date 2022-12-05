import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { SplideService } from 'src/assets/core/utils/splide.service';

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
  constructor(
    private dashboardService: DashboardService,
    public userService: UserService,
    private datePipe: DatePipe,
    private splide: SplideService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getData().subscribe((data) => {
      this.dashboard = data;
      this.dashboardService.dashboard = data;
      this.performance = this.dashboard.performace + ' %';
      let date = this.datePipe
        .transform(this.dashboard.performanceSince, 'dd MMM y')
        ?.toString();
      this.performanceSince = date!;
      this.lastStatsPerformance = this.dashboard.lastStatsPerformance + ' %';
      this.lastStatsBalanceDifference =
        this.dashboard.lastStatsBalanceDifference +
        ' ' +
        this.userService.coinSymbol;
    });
    this.splide.activeSplide();
  }
}
