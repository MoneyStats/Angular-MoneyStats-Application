import { HostListener, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  screenHeight?: number;
  screenWidth?: number;
  environment = environment;
  isCrypto: boolean = false;
  constructor() {}

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  activeHeaderAndFooter() {
    const header = document.getElementById('header');
    header!.style.display = 'flex';
    const footer = document.getElementById('footer');
    footer!.style.display = 'flex';
  }

  setupHeader() {
    this.getScreenSize();
    if (this.screenWidth! <= 780) {
      const header = document.getElementById('header');
      header!.style.display = 'none';
    }
  }

  hideFooter() {
    const footer = document.getElementById('footer');
    footer!.style.display = 'none';
  }
  showFooter() {
    this.getScreenSize();
    if (this.screenWidth! <= 780) {
      const footer = document.getElementById('footer');
      footer!.style.display = 'flex';
    } else this.hideFooter();
  }

  goToDashboard() {
    this.resetAllBtn();
    const dashboard = document.getElementById('dashboard');
    dashboard!.classList.add('active');
  }

  goToWallet() {
    this.resetAllBtn();
    const wallet = document.getElementById('wallet');
    wallet!.classList.add('active');
  }

  goToSettings() {
    this.resetAllBtn();
    const settings = document.getElementById('settings');
    settings!.classList.add('active');
  }

  goToStats() {
    this.resetAllBtn();
    const stats = document.getElementById('stats');
    stats!.classList.add('active');
  }

  resetAllBtn() {
    const dashboard = document.getElementById('dashboard');
    dashboard!.classList.remove('active');

    const wallet = document.getElementById('wallet');
    wallet!.classList.remove('active');

    const settings = document.getElementById('settings');
    settings!.classList.remove('active');

    const stats = document.getElementById('stats');
    stats!.classList.remove('active');
  }
}
