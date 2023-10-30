import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-crypto-resume',
  templateUrl: './crypto-resume.component.html',
  styleUrls: ['./crypto-resume.component.scss'],
})
export class CryptoResumeComponent implements OnInit, OnDestroy {
  getResumeSub: Subscription = new Subscription();
  amount: string = '******';
  hidden: boolean = false;
  assets: Asset[] = [];
  resumeData: CryptoDashboard = new CryptoDashboard();
  resume: Map<string, CryptoDashboard> = new Map<string, CryptoDashboard>();
  years: Array<string> = [];

  isPast: boolean = false;

  constructor(
    public cryptoService: CryptoService,
    private screenService: ScreenService,
    private logger: LoggerService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.getResume();
  }

  getResume() {
    this.getResumeSub = this.cryptoService
      .getCryptoResume()
      .subscribe((res) => {
        this.logger.LOG(res.message!, 'CryptoResumeComponent');
        this.resume = new Map<string, CryptoDashboard>(
          Object.entries(res.data)
        );
        this.years = Array.from(this.resume.keys());
        this.updateData(this.years[this.years.length - 1]);
        this.cryptoService.cryptoResume = this.resume;
        console.log(this.resumeData);
      });
    //this.resumeData = this.cryptoService.cryptoDashboard;
    this.isWalletBalanceHidden();
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

  isOperationPresent() {
    let indexPresent: number = 0;
    if (this.resumeData.wallets)
      this.resumeData.wallets.forEach((w) => {
        if (w.assets && w.assets.length > 0)
          w.assets.forEach((a) => {
            if (a.operations != undefined && a.operations.length > 0)
              indexPresent += 1;
          });
      });
    return indexPresent;
  }

  isWalletBalanceHidden() {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }

  ngOnDestroy(): void {
    this.getResumeSub.unsubscribe();
  }
}
