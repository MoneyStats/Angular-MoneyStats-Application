import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
    standalone: false
})
export class TransactionsComponent implements OnInit, OnDestroy {
  environment = environment;
  dashboardSubscribe: Subscription = new Subscription();
  dashboard?: Dashboard;
  currency: string = UserService.getUserData().settings.currencySymbol;

  constructor(
    private shared: SharedService,
    private dashboardService: DashboardService,
    public screenService: ScreenService
  ) {}

  ngOnDestroy(): void {
    this.dashboardSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.dashboard = this.shared.getDashboard();
    if (Utils.isNullOrEmpty(this.dashboard)) this.getDashboard();
    ScreenService.setupHeader();
    ScreenService.hideFooter();
  }

  isMobile() {
    return ScreenService.isMobileDevice();
  }

  getDashboard() {
    this.dashboardSubscribe = this.dashboardService
      .getDashboardData()
      .subscribe((data) => {
        this.dashboardService.cache.cacheDashboardData(data);
        LOG.info(data.message!, 'TransactionsComponent');
        this.dashboard = this.shared.setDashboard(data.data);
      });
  }
}
