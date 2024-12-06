import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss'],
    standalone: false
})
export class SupportComponent implements OnInit, OnDestroy {
  contactSubscribe: Subscription = new Subscription();

  environment = environment;
  message: string = '';
  name: string = '';
  email: string = '';
  constructor(
    public screenService: ScreenService,
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.contactSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    ScreenService.setupHeader();
    ScreenService.hideFooter();
  }

  isMobile() {
    return ScreenService.isMobileDevice();
  }

  contactSupport() {
    this.contactSubscribe = this.dashboardService
      .contactUs(this.name, this.email, this.message)
      .subscribe((data) => {
        LOG.info(data.message!, 'SupportComponent');
        SwalService.toastMessage(
          SwalIcon.SUCCESS,
          this.translate.instant('response.support')
        );
        this.message = '';
        this.name = '';
        this.email = '';
      });
  }
}
