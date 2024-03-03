import { Component, HostListener, OnInit } from '@angular/core';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { Output, EventEmitter } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  environment = environment;
  dashboard?: Dashboard;

  constructor(
    private dashService: DashboardService,
    public userService: AuthService,
    public screenService: ScreenService
  ) {}

  ngOnInit(): void {
    this.dashboard = this.dashService.dashboard;
    ScreenService.setupHeader();
    ScreenService.hideFooter();
  }

  screenWidth() {
    return ScreenService.screenWidth;
  }
}
