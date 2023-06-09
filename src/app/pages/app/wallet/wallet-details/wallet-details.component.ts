import { Component, Input, OnInit } from '@angular/core';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ActivatedRoute } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/assets/core/utils/toast.service';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.scss'],
})
export class WalletDetailsComponent implements OnInit {
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
  constructor(
    public screenService: ScreenService,
    private route: ActivatedRoute,
    private charts: ChartService,
    public walletService: WalletService,
    private toast: ToastService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.hideFooter();
    this.route.params.subscribe((w: any) => {
      this.walletId = w.id;
      this.walletName = w.wallet;
    });

    this.wallet = this.walletService.walletDetails?.find(
      (w: Wallet) => w.id == this.walletId && w.name === this.walletName
    );

    this.renderGraph();

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

    this.renderImage();
    this.walletService.walletHistory = this.wallet;
    this.coinSymbol = this.walletService.coinSymbol;
  }
  renderImage() {
    if (this.screenService!.screenWidth! <= 780) {
      const image = document.getElementById('gradientSection');
      image!.style.backgroundImage = 'url(' + this.wallet!.img + ')';
    }
  }
  renderGraph() {
    setTimeout(() => {
      this.chartAll = this.charts.renderChartWallet(
        this.wallet?.name!,
        this.wallet?.history!
      );
    }, 100);
  }

  graph1Y() {
    let lastYear = this.wallet?.history.filter(
      (h) =>
        h.date.toString().split('-')[0] === new Date().getFullYear().toString()
    );
    setTimeout(() => {
      this.chart1Y = this.charts.renderChartWallet(
        this.wallet?.name!,
        lastYear!
      );
    }, 200);
  }

  graph3Y() {
    let last3 = [
      new Date().getFullYear().toString(),
      (new Date().getFullYear() - 1).toString(),
      (new Date().getFullYear() - 2).toString(),
    ];
    let last3Year = this.wallet?.history.filter((h) =>
      last3.includes(h.date.toString().split('-')[0])
    );
    setTimeout(() => {
      this.chart3Y = this.charts.renderChartWallet(
        this.wallet?.name!,
        last3Year!
      );
    }, 200);
  }

  percentageWalletInTotal(): number {
    return (this.wallet!.balance * 100) / this.walletService?.totalBalance!;
  }

  addInfo() {
    this.mapInfo.set(this.infoKey, this.infoValue);
    this.infoKeys.push(this.infoKey);
    this.wallet!.infoString = JSON.stringify(Object.fromEntries(this.mapInfo));

    if (this.wallet?.history.find((w) => w.id === undefined)) {
      this.wallet?.history.splice(0, 1);
    }
    this.walletService.addUpdateWallet(this.wallet!).subscribe((data) => {
      this.infoKey = '';
      this.infoValue = '';
      this.addInput = false;
    });
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

    this.walletService.addUpdateWallet(this.wallet!).subscribe((data) => {
      this.infoKey = '';
      this.infoValue = '';
      this.addInput = false;
      this.editBtn = false;
      this.editShow = false;
    });
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
    this.walletService.addUpdateWallet(this.wallet!).subscribe((data) => {
      this.infoKey = '';
      this.infoValue = '';
      this.editShow = false;
    });
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
    this.toast.copiedAvaiable();
  }
}
