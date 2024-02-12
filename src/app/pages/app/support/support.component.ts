import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
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
    private swal: SwalService,
    private logger: LoggerService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.contactSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.hideFooter();
  }

  contactSupport() {
    this.contactSubscribe = this.dashboardService
      .contactUs(this.name, this.email, this.message)
      .subscribe((data) => {
        this.logger.LOG(data.message!, 'SupportComponent');
        this.swal.toastMessage(
          SwalIcon.SUCCESS,
          this.translate.instant('response.support')
        );
        this.message = '';
        this.name = '';
        this.email = '';
      });
  }
}
