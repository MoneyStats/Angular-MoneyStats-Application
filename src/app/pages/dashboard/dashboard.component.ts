import { Component, Input, OnInit, Output } from '@angular/core';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output('dashboard') dashboard: Dashboard = new Dashboard();
  @Output('user') user: User = new User();
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getData().subscribe((data) => {
      this.dashboard = data;
      this.dashboardService.dashboard = data;
    });
  }
}
