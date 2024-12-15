import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import {
  MarketDataCategory,
  ModalConstant,
  OperationsType,
  SelectAssetConstant,
} from 'src/assets/core/data/constant/constant';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { Asset, Operation } from 'src/assets/core/data/class/crypto.class';
import { LOG } from 'src/assets/core/utils/log.service';
import { ChangeDetectorRef } from '@angular/core';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { UserService } from 'src/assets/core/services/api/user.service';

@Component({
  selector: 'app-operation-exchange',
  templateUrl: './operation-exchange.component.html',
  styleUrls: ['./operation-exchange.component.scss'],
  standalone: false,
})
export class OperationExchangeComponent implements OnInit, OnDestroy {
  saveWalletSubscribe: Subscription = new Subscription();
  routeSubscribe: Subscription = new Subscription();
  saveWalletsSubscribe: Subscription = new Subscription();
  getPriceSubscribe: Subscription = new Subscription();
  getCryptoWalletSubscribe: Subscription = new Subscription();

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

  cryptoCurrency: string = '';

  constructor(
    private cryptoService: CryptoService,
    private shared: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    ScreenService.hideFooter();
  }

  ngOnDestroy(): void {
    this.saveWalletSubscribe.unsubscribe();
    this.saveWalletsSubscribe.unsubscribe();
    this.routeSubscribe.unsubscribe();
    this.getPriceSubscribe.unsubscribe();
    this.getCryptoWalletSubscribe.unsubscribe();
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
    this.cryptoCurrency = UserService.getUserData().settings.cryptoCurrency!;
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
      let wallets = Utils.isNullOrEmpty(this.shared.getCryptoWallets())
        ? null
        : Utils.copyObject(this.shared.getCryptoWallets().slice());

      if (Utils.isNullOrEmpty(wallets)) {
        this.getWalletsCryptoData(a.fiat);
      } else this.resumeData(wallets, a.fiat);
    });
  }

  getWalletsCryptoData(currency: string) {
    this.getCryptoWalletSubscribe = this.cryptoService
      .getWalletsCryptoData()
      .subscribe((data) => {
        this.cryptoService.cache.cacheWalletsCryptoData(data);
        LOG.info(data.message!, 'CryptoDashboardComponent');
        const wallets = data.data;
        this.resumeData(wallets, currency);
      });
  }

  resumeData(wallets: any, currency: string) {
    this.filterWalletsTransfer(wallets);
    this.wallet = wallets.find((w: any) => w.name == this.walletSelect)!;
    this.getCryptoPrices(currency);
    if (this.operationType == this.operations.TRADING) {
      let marketData = Utils.copyObject(this.wallet.assets);
      this.stablecoin = marketData.filter(
        (md: any) => md.category == MarketDataCategory.STABLECOIN
      );
    }
  }

  filterWalletsTransfer(wallets: Wallet[]) {
    this.wallets = Utils.copyObject(wallets).filter(
      (wallet: any) => wallet.name != this.walletSelect
    );
  }

  getCryptoPrices(fiat: string) {
    this.getPriceSubscribe = this.cryptoService
      .getCryptoPriceData(fiat)
      .subscribe((data) => {
        this.cryptoService.cache.cacheMarketDataByCurrencyData(data);
        LOG.info(data.message!, 'OperationExchangeComponent');
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
    let assets = Utils.copyObject(this.wallet.assets);
    if (assets && assets.find((a: any) => a.identifier == asset.identifier)!)
      this.assetInWallet = assets.find(
        (a: any) => a.identifier == asset.identifier
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

  exchangeInvestments() {
    let assetBuying =
      this.operationType == OperationsType.NEWINVESTMENT
        ? Utils.copyObject(this.assetInWallet)
        : Utils.copyObject(this.assetToSell);
    assetBuying.lastUpdate = new Date();

    let operation: Operation = new Operation();
    let assetSelling = new Asset();
    let percentualeInvestitoCalcolata = 0;
    let transferedAsset: any = new Asset();

    switch (this.operationType) {
      case OperationsType.NEWINVESTMENT:
        // Setting Invested Money into the Asset
        Utils.isNullOrEmpty(assetBuying.invested)
          ? (assetBuying.invested = this.investedMoney)
          : (assetBuying.invested += this.investedMoney);
        Utils.isNullOrEmpty(assetBuying.balance)
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
        assetSelling = Utils.copyObject(assetParse);

        Utils.isNullOrEmpty(assetSelling.invested)
          ? (assetSelling.invested = percentualeInvestitoCalcolata)
          : (assetSelling.invested += percentualeInvestitoCalcolata);
        Utils.isNullOrEmpty(assetSelling.balance)
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
          ? Utils.copyObject(this.walletToTansfer.assets).find(
              (as: any) => as.identifier == assetBuying.identifier
            )
          : undefined;

        if (transferedAsset == undefined) {
          transferedAsset = Utils.copyObject(this.marketDataSelected);
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

        // Chiud eventuali operazioni di trading se sono presenti e Aperte
        if (
          assetBuying.operations.filter((o: any) => o.status === 'OPEN')
            .length > 0
        ) {
          let open = assetBuying.operations.filter(
            (o: Operation) => o.status === 'OPEN'
          )[0];

          open.status = 'CLOSED';
          open.exitDate = new Date();
          open.exitPrice = assetBuying.current_price;
          let currentPrice = open.entryQuantity! * assetBuying.current_price!;
          open.exitPriceValue = parseFloat(currentPrice.toFixed(2));
          open.exitQuantity = parseFloat(currentPrice.toFixed(8));
          open.performance = parseFloat(
            (
              ((currentPrice - open.entryPriceValue!) / currentPrice) *
              100
            ).toFixed(2)
          );
          open.trend = parseFloat(
            (currentPrice - open.entryPriceValue!).toFixed(2)
          );
          assetBuying.operations = [open];
        }
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

      let walletToSave = Utils.copyObject(this.wallet);

      if (this.operationType != OperationsType.NEWINVESTMENT)
        walletToSave.assets = [assetSelling, assetBuying];
      else walletToSave.assets = [assetBuying];

      this.saveWallet(walletToSave);
    } else {
      operation.exitCoin = operation.entryCoin;
      transferedAsset.operations = [operation];

      let walletSell = Utils.copyObject(this.wallet);
      let walletBuy = Utils.copyObject(this.walletToTansfer);

      walletSell.assets = [assetBuying];
      walletBuy.assets = [transferedAsset];

      this.saveWallets([walletSell, walletBuy]);
    }
  }

  saveWallet(walletToSave: Wallet) {
    this.saveWalletSubscribe = this.cryptoService
      .updateCryptoAsset(walletToSave)
      .subscribe((data) => {
        LOG.info(data.message!, 'OperationExchangeComponent');
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
        SwalService.toastMessage(SwalIcon.SUCCESS, message);
        this.router.navigate(['/crypto/dashboard']);
      });
  }

  saveWallets(wallets: Wallet[]) {
    this.saveWalletsSubscribe = this.cryptoService
      .addOrUpdateCryptoAssets(wallets)
      .subscribe((data) => {
        LOG.info(data.message!, 'OperationExchangeComponent');
        SwalService.toastMessage(
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
        return (
          form.invalid ||
          !this.validateSelect() ||
          !this.disableOnEdit() ||
          this.assetToSell.balance == 0
        );
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
