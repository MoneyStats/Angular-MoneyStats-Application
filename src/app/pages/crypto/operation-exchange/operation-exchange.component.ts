import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import {
  ModalConstant,
  SelectAssetConstant,
} from 'src/assets/core/data/constant/constant';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { Asset, Operation } from 'src/assets/core/data/class/crypto.class';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { AssetSelectComponent } from 'src/app/shared/components/crypto/asset-select/asset-select.component';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';

@Component({
  selector: 'app-operation-exchange',
  templateUrl: './operation-exchange.component.html',
  styleUrls: ['./operation-exchange.component.scss'],
})
export class OperationExchangeComponent implements OnInit {
  fiat: string = '';
  operationType: string = '';
  walletSelect?: string = '';
  wallet: Wallet = new Wallet();

  marketData: Asset[] = [];

  marketDataSelected: Asset = new Asset();
  assetInWallet: Asset = new Asset();
  investedMoney: number = 100;
  assetNewBalance: number = 0;

  constructor(
    private cryptoService: CryptoService,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private logger: LoggerService,
    private swal: SwalService,
    private router: Router
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get assetConstant(): typeof SelectAssetConstant {
    return SelectAssetConstant;
  }

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.route.params.subscribe((a: any) => {
      this.operationType = a.operationType;
      this.walletSelect = a.wallet;
      this.fiat = a.fiat;
      let wallets = deepCopy(
        this.cryptoService.cryptoDashboard.wallets.slice()
      );
      this.wallet = wallets.find((w) => w.name == this.walletSelect)!;
      this.getCryptoPrices(a.fiat);
    });
  }

  getCryptoPrices(fiat: string) {
    this.cryptoService.getCryptoPrice(fiat).subscribe((data) => {
      this.logger.LOG(data.message!, 'OperationExchangeComponent');
      this.marketData = data.data;
    });
  }

  isWalletPresent() {
    return this.walletSelect != undefined;
  }

  emitSelectAsset(asset: Asset) {
    asset.id = undefined;
    asset.lastUpdate = new Date();
    asset.performance = 0;
    asset.trend = 0;
    this.marketDataSelected = asset;
    let assets = deepCopy(this.wallet.assets);
    if (assets.find((a) => a.identifier == asset.identifier)!)
      this.assetInWallet = assets.find(
        (a) => a.identifier == asset.identifier
      )!;
    else this.assetInWallet = asset;
    this.makeNewBalance();
  }

  makeNewBalance() {
    this.assetNewBalance = parseFloat(
      (this.investedMoney / this.marketDataSelected.current_price!).toFixed(8)
    );
  }

  exchangeNewInvestment() {
    let assetToSave = deepCopy(this.assetInWallet);
    Number.isNaN(assetToSave.invested) || assetToSave.invested == undefined
      ? (assetToSave.invested = this.investedMoney)
      : (assetToSave.invested += this.investedMoney);
    Number.isNaN(assetToSave.balance) || assetToSave.balance == undefined
      ? (assetToSave.balance = this.assetNewBalance)
      : (assetToSave.balance += this.assetNewBalance);

    let operation: Operation = new Operation();
    operation.type = this.operationType;
    operation.status = 'CLOSED';
    operation.entryDate = new Date();
    operation.entryCoin = this.fiat;
    operation.entryPrice = assetToSave.current_price;
    operation.entryPriceValue = this.investedMoney;
    operation.entryQuantity = this.assetNewBalance;
    operation.exitDate = new Date();
    operation.exitCoin = assetToSave.symbol;
    operation.exitPrice = assetToSave.current_price;
    operation.exitPriceValue = this.investedMoney;
    operation.exitQuantity = this.assetNewBalance;

    assetToSave.operations = [operation];

    let walletToSave = deepCopy(this.wallet);
    walletToSave.assets = [assetToSave];
    this.cryptoService
      .addOrUpdateCryptoAsset(walletToSave)
      .subscribe((data) => {
        this.swal.toastMessage(SwalIcon.SUCCESS, data.message!);
        this.router.navigate(['/crypto/dashboard']);
      });
  }
}
