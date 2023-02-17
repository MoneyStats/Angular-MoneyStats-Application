import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { Location } from '@angular/common';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  environment = environment;
  counter: number = 1;

  constructor(
    public screenService: ScreenService,
    private location: Location,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.dashboardService.isOnboarding = true;
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
