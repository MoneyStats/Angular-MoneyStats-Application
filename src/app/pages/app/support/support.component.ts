import { Component, OnInit } from '@angular/core';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  environment = environment;
  message: string = '';
  name: string = '';
  email: string = '';
  constructor(
    public screenService: ScreenService,
    private dashboardService: DashboardService,
    private swal: SwalService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.hideFooter();
  }

  contactSupport() {
    this.dashboardService
      .contactUs(this.name, this.email, this.message)
      .subscribe((data) => {
        this.swal.toastMessage(SwalIcon.SUCCESS, data.message!);
        this.message = '';
        this.name = '';
        this.email = '';
      });
  }
}
