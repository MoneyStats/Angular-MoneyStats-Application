import { Component, OnInit } from '@angular/core';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { UserService } from 'src/assets/core/services/api/user.service';
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
  currency: string = UserService.getUserData().settings.currencySymbol;

  constructor(
    private dashService: DashboardService,
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
