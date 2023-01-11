import { Component, OnInit } from '@angular/core';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-add-stats',
  templateUrl: './add-stats.component.html',
  styleUrls: ['./add-stats.component.scss'],
})
export class AddStatsComponent implements OnInit {
  dashboard: Dashboard = new Dashboard();
  constructor(
    public screenService: ScreenService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.dashboard = this.dashboardService.dashboard;
  }
}
