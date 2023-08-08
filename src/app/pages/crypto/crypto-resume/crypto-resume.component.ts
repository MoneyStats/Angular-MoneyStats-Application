import { Component, OnInit } from '@angular/core';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-crypto-resume',
  templateUrl: './crypto-resume.component.html',
  styleUrls: ['./crypto-resume.component.scss'],
})
export class CryptoResumeComponent implements OnInit {
  assets: Asset[] = [];
  resumeData: CryptoDashboard = new CryptoDashboard();
  resume: Map<string, CryptoDashboard> = new Map<string, CryptoDashboard>();
  years: Array<string> = [];

  isPast: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private screenService: ScreenService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.cryptoService.getCryptoResume().subscribe((res) => {
      this.logger.LOG(res.message!, 'CryptoResumeComponent');
      this.resume = new Map<string, CryptoDashboard>(Object.entries(res.data));
      this.years = Array.from(this.resume.keys());
      this.updateData(this.years[this.years.length - 1]);
      this.cryptoService.cryptoResume = this.resume;
      console.log(this.resumeData);
    });
    //this.resumeData = this.cryptoService.cryptoDashboard;
  }

  onChange(e: any) {
    this.updateData(e.target.value);
  }

  updateData(year: string) {
    if (this.years[this.years.length - 1] != year) {
      this.isPast = true;
    } else this.isPast = false;
    this.resumeData = this.resume.get(year)!;
    this.assets = this.resumeData.assets;
  }
}
