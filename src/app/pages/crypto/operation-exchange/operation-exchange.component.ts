import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-operation-exchange',
  templateUrl: './operation-exchange.component.html',
  styleUrls: ['./operation-exchange.component.scss'],
})
export class OperationExchangeComponent implements OnInit, OnDestroy {
  saveWalletSubscribe: Subscription = new Subscription();
  routeSubscribe: Subscription = new Subscription();
  saveWalletsSubscribe: Subscription = new Subscription();
  getPriceSubscribe: Subscription = new Subscription();

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
  investedBalance: number = 0;

  // Trading
  stablecoin: Asset[] = [];

  // Transfer
  walletToTansfer: Wallet = new Wallet();
  wallets?: Wallet[] = [];
  isWalletSelected: boolean = false;
  balanceToTransfer: number = 0;
  isEditFees: boolean = false;
  fees: number = 0;

  operationDate: Date = new Date();

  /* Refactor */
  assetToSell: Asset = new Asset();

  constructor(
    private cryptoService: CryptoService,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private logger: LoggerService,
    private swal: SwalService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.screenService.hideFooter();
  }

  ngOnDestroy(): void {
    this.saveWalletSubscribe.unsubscribe();
    this.saveWalletsSubscribe.unsubscribe();
    this.routeSubscribe.unsubscribe();
    this.getPriceSubscribe.unsubscribe();
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
    this.operationDate = new Date();
    this.routeSubscribe = this.route.params.subscribe((a: any) => {
      this.operationType = a.operationType;
      this.walletSelect = a.wallet;
      this.fiat = a.fiat;
      let wallets = deepCopy(
        this.cryptoService.cryptoDashboard.wallets.slice()
      );
      this.filterWalletsTransfer(wallets);
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

  filterWalletsTransfer(wallets: Wallet[]) {
    this.wallets = deepCopy(wallets).filter(
      (wallet) => wallet.name != this.walletSelect
    );
  }

  getCryptoPrices(fiat: string) {
    this.getPriceSubscribe = this.cryptoService
      .getCryptoPriceData(fiat)
      .subscribe((data) => {
        this.cryptoService.cache.cacheMarketDataByCurrencyData(data);
        this.logger.LOG(data.message!, 'OperationExchangeComponent');
        this.marketData = data.data;
      });
  }

  emitOperationSelectAsset(asset: Asset) {
    this.assetToSell = asset;
    switch (this.operationType) {
      case OperationsType.HOLDING:
      case OperationsType.TRADING:
        this.investedBalance = this.assetToSell.balance;

        this.makeNewBalance();
        break;
      case OperationsType.TRANSFER:
        this.balanceToTransfer = this.assetToSell.balance;
        this.marketDataSelected = asset;
        break;
      default:
        break;
    }
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
    switch (this.operationType) {
      case OperationsType.HOLDING:
      case OperationsType.TRADING:
        this.investedMoney =
          this.assetToSell.current_price! * this.investedBalance;
        this.assetNewBalance = parseFloat(
          (
            (this.assetToSell.current_price! *
              (this.investedBalance - this.fees)) /
            this.marketDataSelected.current_price!
          ).toFixed(8)
        );
        break;
      case OperationsType.NEWINVESTMENT:
        this.assetNewBalance = parseFloat(
          (
            this.investedMoney / this.marketDataSelected.current_price! -
            this.fees
          ).toFixed(8)
        );
        break;
      default:
        break;
    }
    this.isEditFees = false;
  }

  selectTransferWallet(wallet: Wallet) {
    this.walletToTansfer = wallet;
    this.isWalletSelected = true;
  }

  isEmpty(number: number) {
    return Number.isNaN(number) || number == undefined;
  }

  exchangeInvestments() {
    let assetBuying =
      this.operationType == OperationsType.NEWINVESTMENT
        ? deepCopy(this.assetInWallet)
        : deepCopy(this.assetToSell);
    assetBuying.lastUpdate = new Date();

    let operation: Operation = new Operation();
    let assetSelling = new Asset();
    let percentualeInvestitoCalcolata = 0;
    let transferedAsset: any = new Asset();

    switch (this.operationType) {
      case OperationsType.NEWINVESTMENT:
        // Setting Invested Money into the Asset
        this.isEmpty(assetBuying.invested)
          ? (assetBuying.invested = this.investedMoney)
          : (assetBuying.invested += this.investedMoney);
        this.isEmpty(assetBuying.balance)
          ? (assetBuying.balance = this.assetNewBalance)
          : (assetBuying.balance += this.assetNewBalance);

        // Setting Operation for New Investment
        operation.entryCoin = this.fiat;
        operation.entryPrice = assetBuying.current_price;
        operation.exitCoin = assetBuying.symbol;
        operation.exitPrice = assetBuying.current_price;
        break;
      case OperationsType.HOLDING:
      case OperationsType.TRADING:
        percentualeInvestitoCalcolata =
          assetBuying.invested * (this.investedMoney / assetBuying.value!);
        assetBuying.balance -= this.investedBalance;
        if (assetBuying.balance == 0)
          percentualeInvestitoCalcolata = assetBuying.invested;
        assetBuying.invested -= percentualeInvestitoCalcolata;

        const assetAsString = JSON.stringify(this.assetInWallet);
        const assetParse = JSON.parse(assetAsString);
        assetSelling = deepCopy(assetParse);

        this.isEmpty(assetSelling.invested)
          ? (assetSelling.invested = percentualeInvestitoCalcolata)
          : (assetSelling.invested += percentualeInvestitoCalcolata);
        this.isEmpty(assetSelling.balance)
          ? (assetSelling.balance = this.assetNewBalance)
          : (assetSelling.balance += this.assetNewBalance);
        break;
      case OperationsType.TRANSFER:
        percentualeInvestitoCalcolata =
          assetBuying.invested * (this.balanceToTransfer / assetBuying.value!);
        assetBuying.balance -= this.balanceToTransfer;

        if (assetBuying.balance == 0) {
          percentualeInvestitoCalcolata = assetBuying.invested;
        }
        assetBuying.invested -= percentualeInvestitoCalcolata;

        transferedAsset = this.walletToTansfer.assets
          ? deepCopy(this.walletToTansfer.assets).find(
              (as) => as.identifier == assetBuying.identifier
            )
          : undefined;

        if (transferedAsset == undefined) {
          transferedAsset = deepCopy(this.marketDataSelected);
          transferedAsset.balance = 0;
          transferedAsset.id = undefined;
          transferedAsset.invested = 0;
          transferedAsset.performance = 0;
          transferedAsset.trend = 0;
          transferedAsset.lastUpdate = assetBuying.lastUpdate;
          transferedAsset.history = [];
        }

        transferedAsset!.balance += this.balanceToTransfer - this.fees;
        transferedAsset.invested += percentualeInvestitoCalcolata;

        // Setting Operation for Transfer
        operation.entryPriceValue = parseFloat(
          (
            this.balanceToTransfer * this.marketDataSelected.current_price!
          ).toFixed(2)
        );
        operation.entryQuantity = this.balanceToTransfer;
        operation.exitPriceValue = parseFloat(
          (
            (this.balanceToTransfer - this.fees) *
            this.marketDataSelected.current_price!
          ).toFixed(2)
        );
        operation.exitQuantity = this.balanceToTransfer - this.fees;
        operation.performance = 0;
        operation.trend = 0;
        break;
      default:
        break;
    }

    // Setting Operation
    operation.identifier = uuidv4();
    operation.type = this.operationType;
    operation.status =
      this.operationType != OperationsType.TRADING ? 'CLOSED' : 'OPEN';
    operation.entryDate = new Date(this.operationDate);
    operation.fees = this.fees;

    // Setting Operation for Holding & Trading and Transfer
    if (this.operationType != OperationsType.NEWINVESTMENT) {
      operation.entryCoin = assetBuying.symbol;
      operation.entryPrice = this.marketDataSelected.current_price;
      operation.exitCoin = assetSelling.symbol;
      if (this.operationType != OperationsType.TRADING)
        operation.exitPrice = this.marketDataSelected.current_price;
    }
    if (this.operationType != OperationsType.TRANSFER) {
      operation.entryPriceValue = parseFloat(this.investedMoney.toFixed(2));
      operation.entryQuantity = this.assetNewBalance;
    }
    if (this.operationType != OperationsType.TRADING) {
      operation.exitDate = new Date(this.operationDate);
      if (this.operationType != OperationsType.TRANSFER) {
        operation.exitPriceValue = parseFloat(this.investedMoney.toFixed(2));
        operation.exitQuantity = this.investedMoney;
      }
    }
    if (this.operationType != OperationsType.TRANSFER) {
      this.operationType == OperationsType.NEWINVESTMENT
        ? (assetBuying.operations = [operation])
        : (assetSelling.operations = [operation]);

      let walletToSave = deepCopy(this.wallet);

      if (this.operationType != OperationsType.NEWINVESTMENT)
        walletToSave.assets = [assetSelling, assetBuying];
      else walletToSave.assets = [assetBuying];

      this.saveWallet(walletToSave);
    } else {
      transferedAsset.operations = [operation];

      let walletSell = deepCopy(this.wallet);
      let walletBuy = deepCopy(this.walletToTansfer);

      walletSell.assets = [assetBuying];
      walletBuy.assets = [transferedAsset];

      this.saveWallets([walletSell, walletBuy]);
    }
  }

  saveWallet(walletToSave: Wallet) {
    this.saveWalletSubscribe = this.cryptoService
      .addOrUpdateCryptoAsset(walletToSave)
      .subscribe((data) => {
        this.logger.LOG(data.message!, 'OperationExchangeComponent');
        let message =
          walletToSave.assets.length > 1
            ? this.translate
                .instant('response.operation')
                .replace('$OP1$', walletToSave.assets[1].symbol)
                .replace('$OP2$', walletToSave.assets[0].symbol)
            : this.translate
                .instant('response.operation')
                .replace('$OP1$', 'USD')
                .replace('$OP2$', walletToSave.assets[0].symbol);
        this.swal.toastMessage(SwalIcon.SUCCESS, message);
        this.router.navigate(['/crypto/dashboard']);
      });
  }

  saveWallets(wallets: Wallet[]) {
    this.saveWalletsSubscribe = this.cryptoService
      .addOrUpdateCryptoAssets(wallets)
      .subscribe((data) => {
        this.logger.LOG(data.message!, 'OperationExchangeComponent');
        this.swal.toastMessage(
          SwalIcon.SUCCESS,
          this.translate
            .instant('response.operation')
            .replace('$OP1$', wallets[0].name)
            .replace('$OP2$', wallets[1].name)
        );
        this.router.navigate(['/crypto/dashboard']);
      });
  }

  editBalance() {
    this.isEditBalance = false;
    this.makeNewBalance();
  }

  /** Validation Button */
  operationsValidation(form: any) {
    switch (this.operationType) {
      case OperationsType.NEWINVESTMENT:
        return form.invalid || !this.disableOnEdit();
      case OperationsType.HOLDING:
      case OperationsType.TRADING:
        return form.invalid || !this.validateSelect() || !this.disableOnEdit();
      case OperationsType.TRANSFER:
        return (
          form.invalid ||
          !this.validateSelect() ||
          !this.disableOnEdit() ||
          !this.isWalletSelected
        );
      default:
        return false;
    }
  }
  disableOnEdit() {
    return !this.isEditBalance && !this.isEditDate;
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
  /** END Validation Button */
}
