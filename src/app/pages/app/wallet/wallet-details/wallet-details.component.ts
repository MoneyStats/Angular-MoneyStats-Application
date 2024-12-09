import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ActivatedRoute } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { WalletService } from 'src/assets/core/services/api/wallet.service';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { AppService } from 'src/assets/core/services/api/app.service';
import { Subscription } from 'rxjs';
import { LOG } from 'src/assets/core/utils/log.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { User } from 'src/assets/core/data/class/user.class';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { ImageColorPickerService } from 'src/assets/core/utils/image.color.picker.service';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.scss'],
  standalone: false,
})
export class WalletDetailsComponent implements OnInit, OnDestroy {
  user: User = UserService.getUserData();
  walletByIdSubscribe: Subscription = new Subscription();
  routeSubscribe: Subscription = new Subscription();
  saveWalletSubscribe: Subscription = new Subscription();

  amount: string = '******';
  hidden: boolean = false;
  environment = environment;
  public chartAll?: Partial<ApexOptions>;
  public chart1Y?: Partial<ApexOptions>;
  public chart3Y?: Partial<ApexOptions>;

  // INFO VARIABLES
  infoKey: string = '';
  infoValue: string = '';
  addInput: boolean = false;
  editShow: boolean = false;
  editBtn: boolean = false;
  mapInfo: Map<string, string> = new Map();
  infoKeys: Array<string> = [];
  oldKey: string = '';
  oldKeyIndex: number = 0;

  coinSymbol?: string;
  wallet?: Wallet;
  walletName?: string;
  walletId?: number;

  // Crypto Asset
  showZeroBalance: boolean = false;

  thisYear: number = new Date().getFullYear();

  totalBalance: number = 0;
  percentageWallet: number = 100;

  theme: string = '';

  constructor(
    public screenService: ScreenService,
    private route: ActivatedRoute,
    public walletService: WalletService,
    public appService: AppService,
    private shared: SharedService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.routeSubscribe.unsubscribe();
    this.saveWalletSubscribe.unsubscribe();
    this.walletByIdSubscribe.unsubscribe();
  }
  isMobile() {
    return ScreenService.isMobileDevice();
  }

  ngOnInit(): void {
    ScreenService.setupHeader();
    ScreenService.hideFooter();
    if (!Utils.isNullOrEmpty(this.shared.getDashboard()))
      this.totalBalance = this.shared.getDashboard().balance;
    this.routeSubscribe = this.route.params.subscribe((w: any) => {
      this.walletId = w.id;
      this.walletName = w.wallet;

      // Chiamata al servizio
      this.walletByIdSubscribe = this.walletService
        .getWalletByID(this.walletId!)
        .subscribe((res) => {
          this.walletService.cache.cacheWalletByIdData(res, this.walletId!);
          LOG.info(res.message!, 'WalletDetailsComponent');
          this.wallet = res.data;
          this.renderDetailsPage();
          this.percentageWallet = this.percentageWalletInTotal();
        });
    });
  }

  renderDetailsPage() {
    this.graph1Y();

    if (this.wallet?.info != undefined) {
      this.mapInfo = new Map<string, string>(Object.entries(this.wallet.info));
      this.infoKeys = Array.from(this.mapInfo.keys());
    }

    if (
      this.wallet?.history != undefined &&
      this.wallet?.history.find((w) => w.id === undefined)
    ) {
      this.wallet?.history.splice(0, 1);
    } else if (this.wallet?.history == undefined) {
      this.wallet!.history = [];
    }

    if (this.wallet?.img) {
      ImageColorPickerService.getColorFromImage(
        this.wallet?.img,
        '284bff'
      ).then((color) => {
        let backgroud = document.getElementById('gradientSection');
        backgroud!.style.background = color;
      });
    }

    this.renderImage();
    this.shared.setWallet(this.wallet!);
    this.coinSymbol = UserService.getUserData().settings.currencySymbol;
    this.isWalletBalanceHidden();
  }

  renderImage() {
    if (ScreenService.isMobileDevice()) {
      const image = document.getElementById('gradientSection');
      image!.style.backgroundImage = 'url(' + this.wallet!.img + ')';
    }
  }

  graphAll() {
    if (!this.chartAll && this.wallet?.history) {
      setTimeout(() => {
        this.chartAll = ChartService.renderChartWallet(
          this.wallet?.name!,
          this.wallet?.history!
        );
      }, 500);
    }
  }

  graph1Y() {
    if (!this.chart1Y && this.wallet?.history) {
      let lastYear = this.wallet?.history.filter(
        (h) =>
          h.date.toString().split('-')[0] ===
          new Date().getFullYear().toString()
      );
      setTimeout(() => {
        this.chart1Y = ChartService.renderChartWallet(
          this.wallet?.name!,
          lastYear!
        );
      }, 500);
    }
  }

  graph3Y() {
    if (!this.chart3Y && this.wallet?.history) {
      let last3 = [
        new Date().getFullYear().toString(),
        (new Date().getFullYear() - 1).toString(),
        (new Date().getFullYear() - 2).toString(),
      ];
      let last3Year = this.wallet?.history.filter((h) =>
        last3.includes(h.date.toString().split('-')[0])
      );
      setTimeout(() => {
        this.chart3Y = ChartService.renderChartWallet(
          this.wallet?.name!,
          last3Year!
        );
      }, 500);
    }
  }

  percentageWalletInTotal(): number {
    if (this.wallet != undefined && this.totalBalance != 0)
      return (this.wallet!.balance * 100) / this.totalBalance;
    return 0;
  }

  addInfo() {
    this.mapInfo.set(this.infoKey, this.infoValue);
    this.infoKeys.push(this.infoKey);
    this.wallet!.infoString = JSON.stringify(Object.fromEntries(this.mapInfo));

    if (this.wallet?.history.find((w) => w.id === undefined)) {
      this.wallet?.history.splice(0, 1);
    }
    this.saveOrUpdateWallet();
  }

  editInput(key: string) {
    this.addInput = true;
    this.infoKey = key;
    this.infoValue = this.mapInfo.get(key)!.toString();
    this.editBtn = true;
    this.oldKey = key;
    this.oldKeyIndex = this.infoKeys.indexOf(this.oldKey);
    this.infoKeys.splice(this.oldKeyIndex, 1);
  }

  saveEdit() {
    this.mapInfo.set(this.infoKey, this.infoValue);
    this.infoKeys.splice(this.oldKeyIndex, 0, this.infoKey);
    if (this.infoKey != this.oldKey) {
      this.mapInfo.delete(this.oldKey);
    }

    let stringify: string = JSON.stringify(Object.fromEntries(this.mapInfo));
    this.wallet!.info = undefined;
    this.wallet!.infoString = stringify == '{}' ? undefined : stringify;

    if (this.wallet?.history.find((w) => w.id === undefined)) {
      this.wallet?.history.splice(0, 1);
    }

    this.saveOrUpdateWallet();
  }

  deleteInfo(key: string) {
    this.mapInfo.delete(key);
    let index = this.infoKeys.indexOf(key);
    this.infoKeys.splice(index, 1);
    let stringify: string = JSON.stringify(Object.fromEntries(this.mapInfo));
    this.wallet!.info = undefined;
    this.wallet!.infoString = stringify == '{}' ? undefined : stringify;

    if (this.wallet?.history.find((w) => w.id === undefined)) {
      this.wallet?.history.splice(0, 1);
    }
    this.saveOrUpdateWallet();
  }

  editWallet(wallet: Wallet) {
    this.wallet = wallet;
    this.renderImage();
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    /*navigator['clipboard']
      .writeText(val)
      .then()
      .catch((e) => console.error(e));*/
    ToastService.copiedAvaiable();
  }

  // Crypto
  zeroBalanceSwitch() {
    return this.showZeroBalance
      ? (this.showZeroBalance = false)
      : (this.showZeroBalance = true);
  }

  isWalletBalanceHidden() {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }

  saveOrUpdateWallet() {
    this.saveWalletSubscribe = this.walletService
      .addOrUpdateWalletsData(this.wallet!)
      .subscribe((data) => {
        LOG.info(data.message!, 'WalletDetailsComponent');
        this.infoKey = '';
        this.infoValue = '';
        this.addInput = false;
        this.editBtn = false;
        this.editShow = false;
      });
  }
}
