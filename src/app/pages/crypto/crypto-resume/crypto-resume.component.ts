import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { UserService } from 'src/assets/core/services/api/user.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-crypto-resume',
  templateUrl: './crypto-resume.component.html',
  styleUrls: ['./crypto-resume.component.scss'],
  standalone: false,
})
export class CryptoResumeComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  @ViewChild('history') history!: ElementRef;
  getResumeSub: Subscription = new Subscription();
  getCryptoWalletSubscribe: Subscription = new Subscription();
  cryptoAssetSubscribe: Subscription = new Subscription();
  cryptoHistorySubscribe: Subscription = new Subscription();
  getDashboardSubscribe: Subscription = new Subscription();

  amount: string = '******';
  hidden: boolean = false;
  resumeAssets: Asset[] = [];
  resumeData: CryptoDashboard = new CryptoDashboard();
  resume: Map<string, CryptoDashboard> = new Map<string, CryptoDashboard>();
  resumeFullYears: Array<string> = [];

  /** History Object */
  @Output('cryptoAssets') cryptoAssets: Array<Asset> = [];
  @Output('cryptoWallets') cryptoWallets: Array<Wallet> = [];
  @Output('cryptoHistory') cryptoHistory?: Map<number, CryptoDashboard>;
  @Output('cryptoDashboard') cryptoDashboard: CryptoDashboard =
    new CryptoDashboard();

  currentYear = new Date().getFullYear();

  isPast: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private shared: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewChecked() {
    // Forza Angular a verificare i cambiamenti
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.isAssetsWithNoHistory) {
      this.getAssets();
      this.getWalletsCryptoData();
    }
  }

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

        if (UserService.getUserData().mockedUser) {
          const keys = Array.from(this.resume.keys());
          const firstKey = keys.length > 0 ? keys[0] : undefined;
          year = Number.parseInt(firstKey!);
        }

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
    if (
      this.resumeData.yearsWalletStats.length > 0 &&
      Utils.isNullOrEmpty(this.resumeData.statsAssetsDays)
    ) {
      this.getResume(this.resumeData.yearsWalletStats[0]);
      return;
    }
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
          LOG.info(data.message!, 'CryptoResumeComponent');
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
          LOG.info(data.message!, 'CryptoResumeComponent');
          this.cryptoWallets = this.shared.setCryptoWallets(data.data);
        });
    else this.cryptoWallets = this.shared.getCryptoWallets();
  }

  getCryptoHistoryData() {
    if (Utils.isNullOrEmpty(this.shared.getCryptoHistoryData()))
      this.cryptoHistorySubscribe = this.cryptoService
        .getCryptoHistoryData()
        .subscribe((data) => {
          this.cryptoService.cache.cacheCryptoHistoryData(data.data);
          LOG.info(data.message!, 'CryptoResumeComponent');
          this.cryptoHistory = this.shared.setCryptoHistoryData(data.data);
        });
    else this.cryptoHistory = this.shared.getCryptoHistoryData();
  }

  getDashboard() {
    if (Utils.isNullOrEmpty(this.shared.getCryptoDashboardData()))
      this.getDashboardSubscribe = this.cryptoService
        .getCryptoDashboardData()
        .subscribe((data) => {
          this.cryptoService.cache.cacheCryptoDashboardData(data);
          LOG.info(data.message!, 'CryptoResumeComponent');
          this.cryptoDashboard = this.shared.setCryptoDashboardData(data.data);
        });
    else this.cryptoDashboard = this.shared.getCryptoDashboardData();
  }

  goToResume() {
    const resume = document.getElementById('resumeData');
    resume?.click();
  }

  emitOperationClick(click: boolean) {
    this.getWalletsCryptoData();
    this.getDashboard();
  }

  ngOnDestroy(): void {
    this.getResumeSub.unsubscribe();
    this.getCryptoWalletSubscribe.unsubscribe();
    this.cryptoAssetSubscribe.unsubscribe();
    this.cryptoHistorySubscribe.unsubscribe();
    this.getDashboardSubscribe.unsubscribe();
  }

  get isAssetsWithNoHistory(): boolean {
    return (
      !this.resumeData.statsAssetsDays ||
      !this.resumeData.statsAssetsDays.length
    );
    //return (
    //  !this.resumeAssets?.length ||
    //  this.resumeAssets.every(
    //    (asset) => !asset.history || !asset.history.length
    //  )
    //);
  }
}
