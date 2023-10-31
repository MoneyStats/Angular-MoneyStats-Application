import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import {
  MarketDataCategory,
  ModalConstant,
  OperationsType,
  SelectAssetConstant,
} from 'src/assets/core/data/constant/constant';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { Asset, Operation } from 'src/assets/core/data/class/crypto.class';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { ChangeDetectorRef } from '@angular/core';
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

  // Usate per modificare la data dell'operazione e il saldo dell'asset
  isEditBalance: boolean = false;
  isEditDate: boolean = false;

  marketData: Asset[] = [];

  marketDataSelected: Asset = new Asset();
  assetInWallet: Asset = new Asset();
  investedMoney: number = 100;
  assetNewBalance: number = 0;

  // Holding
  holdingAssetToSell: Asset = new Asset();
  investedBalance: number = 0;

  // Trading
  tradingAssetToSell: Asset = new Asset();
  stablecoin: Asset[] = [];

  constructor(
    private cryptoService: CryptoService,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private logger: LoggerService,
    private swal: SwalService,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {
    this.screenService.hideFooter();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get assetConstant(): typeof SelectAssetConstant {
    return SelectAssetConstant;
  }

  public get operations(): typeof OperationsType {
    return OperationsType;
  }

  ngOnInit(): void {
    this.getOperationExchange();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getOperationExchange() {
    this.route.params.subscribe((a: any) => {
      this.operationType = a.operationType;
      this.walletSelect = a.wallet;
      this.fiat = a.fiat;
      let wallets = deepCopy(
        this.cryptoService.cryptoDashboard.wallets.slice()
      );
      this.wallet = wallets.find((w) => w.name == this.walletSelect)!;
      this.getCryptoPrices(a.fiat);
      if (this.operationType == this.operations.TRADING) {
        let marketData = deepCopy(this.wallet.assets);
        this.stablecoin = marketData.filter(
          (md) => md.category == MarketDataCategory.STABLECOIN
        );
      }
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

  emitHoldingSelectAsset(asset: Asset) {
    this.holdingAssetToSell = asset;
    this.investedBalance = this.holdingAssetToSell.balance;

    this.makeNewBalance();
  }

  emitTradingSelectAsset(asset: Asset) {
    this.tradingAssetToSell = asset;
    this.investedBalance = this.tradingAssetToSell.balance;

    this.makeNewBalance();
  }

  emitSelectAsset(asset: Asset) {
    asset.id = undefined;
    asset.lastUpdate = new Date();
    //asset.lastUpdate = this.marketDataSelected.lastUpdate;
    //asset.current_price = this.marketDataSelected.current_price;
    asset.performance = 0;
    asset.trend = 0;
    this.marketDataSelected = asset;
    let assets = deepCopy(this.wallet.assets);
    if (assets && assets.find((a) => a.identifier == asset.identifier)!)
      this.assetInWallet = assets.find(
        (a) => a.identifier == asset.identifier
      )!;
    else this.assetInWallet = asset;
    this.makeNewBalance();
  }

  makeNewBalance() {
    if (this.operationType == OperationsType.HOLDING)
      this.investedMoney =
        this.holdingAssetToSell.current_price! * this.investedBalance;
    if (this.operationType == OperationsType.TRADING)
      this.investedMoney =
        this.tradingAssetToSell.current_price! * this.investedBalance;
    this.assetNewBalance = parseFloat(
      (this.investedMoney / this.marketDataSelected.current_price!).toFixed(8)
    );
  }

  exchangeTradingInvestment() {
    let tradingAsset = deepCopy(this.tradingAssetToSell);
    tradingAsset.lastUpdate = new Date();

    let percentualeInvestitoCalcolata =
      tradingAsset.invested * (this.investedMoney / tradingAsset.value!);
    tradingAsset.balance -= this.investedBalance;
    if (tradingAsset.balance == 0) {
      percentualeInvestitoCalcolata = tradingAsset.invested;
    }
    tradingAsset.invested -= percentualeInvestitoCalcolata;

    let assetToSave = deepCopy(this.assetInWallet);
    if (!assetToSave.performance) {
      assetToSave.performance = 0;
      assetToSave.trend = 0;
    }
    Number.isNaN(assetToSave.invested) || assetToSave.invested == undefined
      ? (assetToSave.invested = percentualeInvestitoCalcolata)
      : (assetToSave.invested += percentualeInvestitoCalcolata);
    Number.isNaN(assetToSave.balance) || assetToSave.balance == undefined
      ? (assetToSave.balance = this.assetNewBalance)
      : (assetToSave.balance += this.assetNewBalance);
    let operation: Operation = new Operation();
    operation.type = this.operationType;
    operation.status = 'OPEN';
    operation.entryDate = new Date(this.marketDataSelected.lastUpdate);
    operation.entryCoin = tradingAsset.symbol;
    operation.entryPrice = this.marketDataSelected.current_price;
    operation.entryPriceValue = parseFloat(
      percentualeInvestitoCalcolata.toFixed(2)
    );
    operation.entryQuantity = this.assetNewBalance;
    operation.exitCoin = assetToSave.symbol;

    assetToSave.operations = [operation];

    let walletToSave = deepCopy(this.wallet);
    walletToSave.assets = [assetToSave, tradingAsset];
    this.saveWallet(walletToSave);
  }

  exchangeHoldingInvestment() {
    let holdingAsset = deepCopy(this.holdingAssetToSell);
    holdingAsset.lastUpdate = new Date();

    let percentualeInvestitoCalcolata =
      holdingAsset.invested * (this.investedMoney / holdingAsset.value!);
    holdingAsset.balance -= this.investedBalance;
    if (holdingAsset.balance == 0) {
      percentualeInvestitoCalcolata = holdingAsset.invested;
    }
    holdingAsset.invested -= percentualeInvestitoCalcolata;

    let assetToSave = deepCopy(this.assetInWallet);
    if (!assetToSave.performance) {
      assetToSave.performance = 0;
      assetToSave.trend = 0;
    }
    Number.isNaN(assetToSave.invested) || assetToSave.invested == undefined
      ? (assetToSave.invested = percentualeInvestitoCalcolata)
      : (assetToSave.invested += percentualeInvestitoCalcolata);
    Number.isNaN(assetToSave.balance) || assetToSave.balance == undefined
      ? (assetToSave.balance = this.assetNewBalance)
      : (assetToSave.balance += this.assetNewBalance);
    let operation: Operation = new Operation();
    operation.type = this.operationType;
    operation.status = 'CLOSED';
    operation.entryDate = new Date(this.marketDataSelected.lastUpdate);
    operation.entryCoin = holdingAsset.symbol;
    operation.entryPrice = this.marketDataSelected.current_price;
    operation.entryPriceValue = this.investedMoney;
    //operation.entryQuantity = this.investedBalance;
    operation.entryQuantity = this.assetNewBalance;
    operation.exitDate = new Date(this.marketDataSelected.lastUpdate);
    operation.exitCoin = assetToSave.symbol;
    operation.exitPrice = this.marketDataSelected.current_price;
    operation.exitPriceValue = this.investedMoney;
    //operation.exitQuantity = this.assetNewBalance;
    operation.exitQuantity = this.investedMoney;

    assetToSave.operations = [operation];

    let walletToSave = deepCopy(this.wallet);
    walletToSave.assets = [assetToSave, holdingAsset];
    this.saveWallet(walletToSave);
  }

  exchangeNewInvestment() {
    let assetToSave = deepCopy(this.assetInWallet);
    if (!assetToSave.performance) {
      assetToSave.performance = 0;
      assetToSave.trend = 0;
    }
    Number.isNaN(assetToSave.invested) || assetToSave.invested == undefined
      ? (assetToSave.invested = this.investedMoney)
      : (assetToSave.invested += this.investedMoney);
    Number.isNaN(assetToSave.balance) || assetToSave.balance == undefined
      ? (assetToSave.balance = this.assetNewBalance)
      : (assetToSave.balance += this.assetNewBalance);

    let operation: Operation = new Operation();
    operation.type = this.operationType;
    operation.status = 'CLOSED';
    operation.entryDate = new Date(assetToSave.lastUpdate);
    operation.entryCoin = this.fiat;
    operation.entryPrice = assetToSave.current_price;
    operation.entryPriceValue = this.investedMoney;
    //operation.entryQuantity = this.investedMoney;
    operation.entryQuantity = this.assetNewBalance;
    operation.exitDate = assetToSave.lastUpdate;
    operation.exitCoin = assetToSave.symbol;
    operation.exitPrice = assetToSave.current_price;
    operation.exitPriceValue = this.investedMoney;
    //operation.exitQuantity = this.assetNewBalance;
    operation.exitQuantity = this.investedMoney;

    assetToSave.operations = [operation];

    let walletToSave = deepCopy(this.wallet);
    walletToSave.assets = [assetToSave];
    this.saveWallet(walletToSave);
  }

  saveWallet(walletToSave: Wallet) {
    this.cryptoService
      .addOrUpdateCryptoAsset(walletToSave)
      .subscribe((data) => {
        this.swal.toastMessage(SwalIcon.SUCCESS, data.message!);
        this.router.navigate(['/crypto/dashboard']);
      });
  }

  validateSelect() {
    if (
      this.wallet.assets ||
      this.operationType == OperationsType.NEWINVESTMENT
    ) {
      return true;
    }
    return false;
  }

  disableOnEdit() {
    return !this.isEditBalance && !this.isEditDate;
  }

  editBalance() {
    this.isEditBalance = false;
    this.makeNewBalance();
  }
}
