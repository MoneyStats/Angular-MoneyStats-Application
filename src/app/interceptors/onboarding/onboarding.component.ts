import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { Location } from '@angular/common';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/assets/core/services/api/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  standalone: false,
})
export class OnboardingComponent implements OnInit {
  isCrypto: boolean = false;
  environment = environment;
  counter: number = 1;

  constructor(
    public screenService: ScreenService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentPath = this.router.url; // Ottieni il percorso attuale
    if (currentPath.includes('/on-boarding/crypto')) {
      this.isCrypto = true;
    } else if (currentPath.includes('/on-boarding')) {
      this.isCrypto = false;
    }
  }

  next(): void {
    if (this.counter < 4) {
      this.counter++;
    }
  }

  prev(): void {
    if (this.counter > 1) {
      this.counter--;
    }
  }

  goBack(): void {
    this.location.back();
  }

  getImageUrl(index: number): string {
    const images = [
      `${this.environment.baseUrlDashboard}assets/images/logos/favicon_trasparent.png`,
      `${this.environment.baseUrlDashboard}assets/images/sample/why.png`,
      `${this.environment.baseUrlDashboard}assets/images/sample/add-wallet.png`,
      `${this.environment.baseUrlDashboard}assets/images/sample/checked.png.png`,
    ];
    return images[index - 1];
  }

  getCryptoImageUrl(index: number): string {
    const cryptoImages = [
      `${this.environment.baseUrlDashboard}assets/images/crypto/Bitcoin-icon.png`,
      `${this.environment.baseUrlDashboard}assets/images/sample/why.png`,
      `${this.environment.baseUrlDashboard}assets/images/sample/add-wallet.png`,
      `${this.environment.baseUrlDashboard}assets/images/sample/checked.png.png`,
    ];
    return cryptoImages[index - 1];
  }

  setCounter(index: number): void {
    this.counter = index;
  }
}
