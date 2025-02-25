import { HostListener, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private static screenHeight?: number = window.innerHeight;
  private static screenWidth?: number = window.innerWidth;
  private static isMobile: boolean = false;
  environment = environment;
  isCrypto: boolean = false;
  constructor() {}

  @HostListener('window:resize', ['$event'])
  public static getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.updateMobileStatus(); // Rileva di nuovo lo stato mobile al resize
  }

  // Aggiungi un metodo per determinare se siamo su un dispositivo mobile
  private static updateMobileStatus() {
    this.isMobile = this.screenWidth! <= 768; // Considera mobile se la larghezza è <= 768px
  }

  public static activeHeaderAndFooter() {
    const header = document.getElementById('header');
    header!.style.display = 'flex';
    const footer = document.getElementById('footer');
    footer!.style.display = 'flex';
  }

  public static setupHeader() {
    this.getScreenSize();
    if (this.screenWidth! <= 780) {
      const header = document.getElementById('header');
      header!.style.display = 'none';
    }
  }

  public static hideFooter() {
    this.getScreenSize();
    if (this.screenWidth! <= 780) {
      const footer = document.getElementById('footer');
      if (footer) footer!.style.display = 'none';
    }
  }
  public static showFooter() {
    this.getScreenSize();
    if (this.screenWidth! <= 780) {
      const footer = document.getElementById('footer');
      footer!.style.display = 'flex';
    } else this.hideFooter();
  }

  public static goToDashboard() {
    this.resetAllBtn();
    const dashboard = document.getElementById('dashboard');
    dashboard!.classList.add('active');
  }

  public static goToWallet() {
    this.resetAllBtn();
    const wallet = document.getElementById('wallet');
    wallet!.classList.add('active');
  }

  public static goToSettings() {
    this.resetAllBtn();
    const settings = document.getElementById('settings');
    settings!.classList.add('active');
  }

  public static goToStats() {
    this.resetAllBtn();
    const stats = document.getElementById('stats');
    stats!.classList.add('active');
  }

  public static resetAllBtn() {
    const dashboard = document.getElementById('dashboard');
    dashboard!.classList.remove('active');

    const wallet = document.getElementById('wallet');
    wallet!.classList.remove('active');

    const settings = document.getElementById('settings');
    settings!.classList.remove('active');

    const stats = document.getElementById('stats');
    stats!.classList.remove('active');
  }

  // Metodo per verificare se siamo su mobile
  public static isMobileDevice(): boolean {
    this.getScreenSize();
    return this.isMobile;
  }
}
