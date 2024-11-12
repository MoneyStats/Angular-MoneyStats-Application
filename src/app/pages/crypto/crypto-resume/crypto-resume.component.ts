import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  OperationsType,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-crypto-resume',
  templateUrl: './crypto-resume.component.html',
  styleUrls: ['./crypto-resume.component.scss'],
})
export class CryptoResumeComponent implements OnInit, OnDestroy {
  getResumeSub: Subscription = new Subscription();
  getCryptoWalletSubscribe: Subscription = new Subscription();
  cryptoAssetSubscribe: Subscription = new Subscription();

  amount: string = '******';
  hidden: boolean = false;
  resumeAssets: Asset[] = [];
  resumeData: CryptoDashboard = new CryptoDashboard();
  resume: Map<string, CryptoDashboard> = new Map<string, CryptoDashboard>();
  resumeFullYears: Array<string> = [];

  /** History Object */
  @Output('cryptoAssets') cryptoAssets: Array<Asset> = [];
  @Output('cryptoWallets') cryptoWallets: Array<Wallet> = [];

  currentYear = new Date().getFullYear();

  isPast: boolean = false;

  constructor(
    public cryptoService: CryptoService,
    private shared: SharedService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    ScreenService.hideFooter();
    this.getResume(this.currentYear);
  }

  getResume(year: number) {
    this.getResumeSub = this.cryptoService
      .getCryptoResumeData(year)
      .subscribe((res) => {
        this.cryptoService.cache.cacheCryptoResumeData(res, year);
        LOG.info(res.message!, 'CryptoResumeComponent');
        this.resume = new Map<string, CryptoDashboard>(
          Object.entries(res.data)
        );

        this.resumeFullYears = [];
        // Ottieni l'array di anni senza duplicati e in ordine decrescente
        const uniqueYears = Array.from(
          new Set(this.resume.get(year.toString())?.yearsWalletStats ?? [])
        ).sort((a, b) => a - b);

        // Aggiungi gli anni ordinati in ordine decrescente all'array resumeFullYears
        uniqueYears.forEach((y) => {
          this.resumeFullYears.push(y.toString());
        });

        this.updateData(year.toString());

        //this.resumeFullYears = Array.from(this.resume.keys());
        //this.updateData(this.resumeFullYears[this.resumeFullYears.length - 1]);
        //this.cryptoService.cryptoResume = this.resume;
      });
    //this.resumeData = this.cryptoService.cryptoDashboard;
    this.isWalletBalanceHidden();
  }

  onChange(e: any) {
    this.getResume(e.target.value);
  }

  updateData(year: string) {
    if (this.resumeFullYears[this.resumeFullYears.length - 1] != year) {
      this.isPast = true;
    } else this.isPast = false;
    this.resumeData = this.resume.get(year)!;
    this.resumeAssets = this.resumeData.assets;
  }

  isOperationPresent() {
    let indexPresent: number = 0;
    if (this.resumeData.wallets)
      this.resumeData.wallets.forEach((w) => {
        if (w.assets && w.assets.length > 0)
          w.assets.forEach((a) => {
            if (a.operations && a.operations.length > 0) {
              let operations = a.operations.filter(
                (o) =>
                  o.operationsType == OperationsType.TRADING ||
                  o.type == OperationsType.TRADING
              );
              if (operations != undefined && operations.length > 0)
                indexPresent += 1;
            }
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

  getAssets() {
    if (Utils.isNullOrEmpty(this.shared.getCryptoAssets()))
      this.cryptoAssetSubscribe = this.cryptoService
        .getCryptoAssetsData()
        .subscribe((data) => {
          this.cryptoService.cache.cacheAssetsData(data);
          LOG.info(data.message!, 'CryptoAssetComponent');
          this.cryptoAssets = this.shared.setCryptoAssets(data.data);
        });
    else this.cryptoAssets = this.shared.getCryptoAssets();
  }

  getWalletsCryptoData() {
    if (Utils.isNullOrEmpty(this.shared.getCryptoWallets()))
      this.getCryptoWalletSubscribe = this.cryptoService
        .getWalletsCryptoData()
        .subscribe((data) => {
          this.cryptoService.cache.cacheWalletsCryptoData(data);
          LOG.info(data.message!, 'CryptoDashboardComponent');
          this.cryptoWallets = this.shared.setCryptoWallets(data.data);
        });
    else this.cryptoWallets = this.shared.getCryptoWallets();
  }

  ngOnDestroy(): void {
    this.getResumeSub.unsubscribe();
    this.cryptoAssetSubscribe.unsubscribe();
    this.cryptoAssetSubscribe.unsubscribe();
  }
}
