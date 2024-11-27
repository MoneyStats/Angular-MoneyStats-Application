import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { Location } from '@angular/common';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/assets/core/services/api/app.service';

@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss'],
    standalone: false
})
export class OnboardingComponent implements OnInit {
  isCrypto: boolean = false;
  environment = environment;
  counter: number = 1;

  constructor(
    public screenService: ScreenService,
    private location: Location,
    private dashboardService: DashboardService,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    //this.screenService.setupHeader();
    if (this.appService.isOnboardingCrypto) {
      this.isCrypto = true;
      this.appService.isOnboardingCrypto = true;
    } else {
      this.dashboardService.isOnboarding = true;
    }
  }

  next() {
    return (this.counter += 1);
  }

  prev() {
    return (this.counter -= 1);
  }

  goBack() {
    this.location.back();
  }
}
