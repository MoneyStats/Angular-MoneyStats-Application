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
  isEditSellBalance: boolean = false;
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

  operationDate: string = Utils.formatDate(new Date());

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

  public get marktDataCategory(): typeof MarketDataCategory {
    return MarketDataCategory;
  }

  ngOnInit(): void {
    this.cryptoCurrency =
      UserService.getUserData().attributes.money_stats_settings.cryptoCurrency!;
    this.getOperationExchange();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getOperationExchange() {
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
    let assetToBeSelled = this.getAssetToBuy();
    assetToBeSelled.lastUpdate = new Date();

    let operation: Operation = new Operation();
    let assetToExchange = new Asset();
    let percentualeInvestitoCalcolata = 0;
    let transferedAsset: any = new Asset();

    switch (this.operationType) {
      case OperationsType.NEWINVESTMENT:
        this.handleNewInvestment(assetToBeSelled, operation);
        break;
      case OperationsType.HOLDING:
      case OperationsType.TRADING:
        assetToExchange = this.handleTradingHolding(assetToBeSelled);
        break;
        //percentualeInvestitoCalcolata =
        //  assetToBeSelled.invested *
        //  (this.investedMoney / assetToBeSelled.value!);
        //assetToBeSelled.balance -= this.investedBalance;
        //if (assetToBeSelled.balance == 0)
        //  percentualeInvestitoCalcolata = assetToBeSelled.invested;
        //assetToBeSelled.invested -= percentualeInvestitoCalcolata;

        //const assetAsString = JSON.stringify(this.assetInWallet);
        //const assetParse = JSON.parse(assetAsString);
        //assetToExchange = Utils.copyObject(assetParse);
        //const asset1 = Utils.copyObject(assetToBeSelled);
        //const asset2 = Utils.copyObject(assetToExchange);

        //const percentageInvested = this.calculatePercentageInvested(
        //  assetToBeSelled.balance,
        //  this.investedBalance
        //);
        //
        //const investedToTransfer = this.calculateInvestment(
        //  assetToBeSelled.invested,
        //  percentageInvested
        //);
        //
        //console.log(investedToTransfer, this.investedBalance);
        //
        //const investedToMove = assetToBeSelled.invested - investedToTransfer;
        //console.log('REMOVE', investedToMove);
        //
        //assetToBeSelled.invested = Math.max(0, investedToTransfer);
        //
        ////Utils.isNullOrEmpty(assetToExchange.invested)
        ////  ? (assetToExchange.invested = percentualeInvestitoCalcolata)
        ////  : (assetToExchange.invested += percentualeInvestitoCalcolata);
        //Utils.isNullOrEmpty(assetToExchange.invested)
        //  ? (assetToExchange.invested = investedToMove)
        //  : (assetToExchange.invested += investedToMove);
        //Utils.isNullOrEmpty(assetToExchange.balance)
        //  ? (assetToExchange.balance = this.assetNewBalance)
        //  : (assetToExchange.balance += this.assetNewBalance);
        //break;

        // OLD DATA
        //percentualeInvestitoCalcolata =
        //  assetToBeSelled.invested *
        //  (this.investedMoney / assetToBeSelled.value!);
        //assetToBeSelled.balance -= this.investedBalance;
        //if (assetToBeSelled.balance == 0)
        //  percentualeInvestitoCalcolata = assetToBeSelled.invested;
        //assetToBeSelled.invested -= percentualeInvestitoCalcolata;
        //
        //const assetAsString = JSON.stringify(this.assetInWallet);
        //const assetParse = JSON.parse(assetAsString);
        //assetToExchange = Utils.copyObject(assetParse);
        //
        //Utils.isNullOrEmpty(assetToExchange.invested)
        //  ? (assetToExchange.invested = percentualeInvestitoCalcolata)
        //  : (assetToExchange.invested += percentualeInvestitoCalcolata);
        //Utils.isNullOrEmpty(assetToExchange.balance)
        //  ? (assetToExchange.balance = this.assetNewBalance)
        //  : (assetToExchange.balance += this.assetNewBalance);
        //break;
      case OperationsType.TRANSFER:
        percentualeInvestitoCalcolata =
          assetToBeSelled.invested *
          (this.balanceToTransfer / assetToBeSelled.value!);
        assetToBeSelled.balance -= this.balanceToTransfer;

        if (assetToBeSelled.balance == 0) {
          percentualeInvestitoCalcolata = assetToBeSelled.invested;
        }
        assetToBeSelled.invested -= percentualeInvestitoCalcolata;

        transferedAsset = this.walletToTansfer.assets
          ? Utils.copyObject(this.walletToTansfer.assets).find(
              (as: any) => as.identifier == assetToBeSelled.identifier
            )
          : undefined;

        if (transferedAsset == undefined) {
          transferedAsset = Utils.copyObject(this.marketDataSelected);
          transferedAsset.balance = 0;
          transferedAsset.id = undefined;
          transferedAsset.invested = 0;
          transferedAsset.performance = 0;
          transferedAsset.trend = 0;
          transferedAsset.lastUpdate = assetToBeSelled.lastUpdate;
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
        operation.exitQuantity = parseFloat(
          (this.balanceToTransfer - this.fees).toFixed(8)
        );
        operation.performance = 0;
        operation.trend = 0;

        // Chiud eventuali operazioni di trading se sono presenti e Aperte
        if (
          assetToBeSelled.operations.filter((o: any) => o.status === 'OPEN')
            .length > 0
        ) {
          let open = assetToBeSelled.operations.filter(
            (o: Operation) => o.status === 'OPEN'
          )[0];

          open.status = 'CLOSED';
          open.exitDate = new Date();
          open.exitPrice = assetToBeSelled.current_price;
          let currentPrice =
            open.entryQuantity! * assetToBeSelled.current_price!;
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
          assetToBeSelled.operations = [open];
        }
        break;
      default:
        break;
    }

    this.finalizeOperation(
      assetToBeSelled,
      assetToExchange,
      transferedAsset,
      operation
    );
    // Setting Operation
    //operation.identifier = uuidv4();
    //operation.type = this.operationType;
    //operation.status =
    //  this.operationType != OperationsType.TRADING ? 'CLOSED' : 'OPEN';
    //operation.entryDate = new Date(this.operationDate);
    //operation.fees = this.fees;
    //
    //// Setting Operation for Holding & Trading and Transfer
    //if (this.operationType != OperationsType.NEWINVESTMENT) {
    //  operation.entryCoin = assetToBeSelled.symbol;
    //  operation.entryPrice =
    //    this.marketDataSelected.category == MarketDataCategory.STABLECOIN
    //      ? this.assetToSell.current_price!
    //      : this.marketDataSelected.current_price;
    //  operation.exitCoin = assetToExchange.symbol;
    //  if (this.operationType != OperationsType.TRADING)
    //    operation.exitPrice =
    //      this.marketDataSelected.category == MarketDataCategory.STABLECOIN
    //        ? this.assetToSell.current_price!
    //        : this.marketDataSelected.current_price;
    //}
    //if (this.operationType != OperationsType.TRANSFER) {
    //  operation.entryPriceValue = parseFloat(this.investedMoney.toFixed(2));
    //  operation.entryQuantity = this.assetNewBalance;
    //}
    //if (this.operationType != OperationsType.TRADING) {
    //  operation.exitDate = new Date(this.operationDate);
    //  if (this.operationType != OperationsType.TRANSFER) {
    //    operation.exitPriceValue = parseFloat(this.investedMoney.toFixed(2));
    //    operation.exitQuantity = this.investedMoney;
    //  }
    //}
    //if (this.operationType != OperationsType.TRANSFER) {
    //  this.operationType == OperationsType.NEWINVESTMENT
    //    ? (assetToBeSelled.operations = [operation])
    //    : (assetToExchange.operations = [operation]);
    //
    //  let walletToSave = Utils.copyObject(this.wallet);
    //
    //  if (this.operationType != OperationsType.NEWINVESTMENT)
    //    walletToSave.assets = [assetToExchange, assetToBeSelled];
    //  else walletToSave.assets = [assetToBeSelled];
    //
    //  this.saveWallet(walletToSave);
    //} else {
    //  operation.exitCoin = operation.entryCoin;
    //  transferedAsset.operations = [operation];
    //
    //  let walletSell = Utils.copyObject(this.wallet);
    //  let walletBuy = Utils.copyObject(this.walletToTansfer);
    //
    //  walletSell.assets = [assetToBeSelled];
    //  walletBuy.assets = [transferedAsset];
    //
    //  this.saveWallets([walletSell, walletBuy]);
    //}
  }

  /** Recupera l'asset da acquistare */
  getAssetToBuy() {
    return this.operationType === OperationsType.NEWINVESTMENT
      ? Utils.copyObject(this.assetInWallet)
      : Utils.copyObject(this.assetToSell);
  }

  /** Gestisce l'operazione di nuovo investimento */
  handleNewInvestment(assetToBeSelled: Asset, operation: Operation) {
    assetToBeSelled.invested =
      (assetToBeSelled.invested || 0) + this.investedMoney;
    assetToBeSelled.balance =
      (assetToBeSelled.balance || 0) + this.assetNewBalance;

    // Setting Operation for New Investment
    operation.entryCoin = this.fiat;
    operation.entryPrice = this.marketDataSelected.current_price;
    operation.exitCoin = assetToBeSelled.symbol;
    operation.exitPrice = this.marketDataSelected.current_price;
  }

  /** Gestisce le operazioni di Trading e Holding */
  handleTradingHolding(assetToBeSelled: Asset): Asset {
    let assetToExchange = Utils.copyObject(this.assetInWallet);
    const percentageInvested = this.calculatePercentageInvested(
      assetToBeSelled.balance,
      this.investedBalance
    );

    const investedToTransfer = this.calculateInvestment(
      assetToBeSelled.invested,
      percentageInvested
    );

    const investedToMove = assetToBeSelled.invested - investedToTransfer;

    assetToBeSelled.invested = Math.max(0, investedToTransfer);
    assetToBeSelled.balance -= this.investedBalance;

    assetToExchange.invested = (assetToExchange.invested || 0) + investedToMove;
    assetToExchange.balance =
      (assetToExchange.balance || 0) + this.assetNewBalance;
    return assetToExchange;
  }

  /** Gestisce l'operazione di trasferimento */
  handleTransfer(assetBuying: Asset, operation: Operation) {
    //let percentInvested = this.calculatePercentageInvestedNew(
    //  assetBuying,
    //  this.balanceToTransfer
    //);
    //assetBuying.balance -= this.balanceToTransfer;
    //assetBuying.invested -= percentInvested;
    //
    //let transferredAsset = this.getTransferredAsset(assetBuying);
    //transferredAsset!.balance += this.balanceToTransfer - this.fees;
    //transferredAsset!.invested += percentInvested;
    //
    //this.closeOpenOperations(assetBuying);
    //
    //return transferredAsset;
  }

  /** Recupera o inizializza l'asset trasferito */
  getTransferredAsset(assetBuying: Asset) {
    let asset = this.walletToTansfer.assets?.find(
      (as) => as.identifier === assetBuying.identifier
    );
    if (!asset) {
      asset = {
        ...Utils.copyObject(this.marketDataSelected),
        balance: 0,
        invested: 0,
        performance: 0,
        trend: 0,
        history: [],
      };
    }
    return asset;
  }

  /** Chiude eventuali operazioni aperte */
  closeOpenOperations(assetBuying: Asset) {
    let openOperations = assetBuying.operations.filter(
      (o) => o.status === 'OPEN'
    );
    if (openOperations.length > 0) {
      let open = openOperations[0];
      open.status = 'CLOSED';
      open.exitDate = new Date();
      open.exitPrice = assetBuying.current_price;
      let currentValue = open.entryQuantity! * assetBuying.current_price!;
      open.exitPriceValue = parseFloat(currentValue.toFixed(2));
      open.exitQuantity = parseFloat(currentValue.toFixed(8));
      open.performance = parseFloat(
        (((currentValue - open.entryPriceValue!) / currentValue) * 100).toFixed(
          2
        )
      );
      open.trend = parseFloat(
        (currentValue - open.entryPriceValue!).toFixed(2)
      );
      assetBuying.operations = [open];
    }
  }

  /** Finalizza l'operazione e salva i dati */
  finalizeOperation(
    assetToBeSelled: Asset,
    assetToExchange: Asset,
    transferredAsset: Asset,
    operation: Operation
  ) {
    operation.identifier = uuidv4();
    operation.type = this.operationType;
    operation.status =
      this.operationType !== OperationsType.TRADING ? 'CLOSED' : 'OPEN';
    operation.entryDate = new Date(this.operationDate);
    operation.fees = this.fees;

    if (this.operationType !== OperationsType.NEWINVESTMENT) {
      operation.entryCoin = assetToBeSelled.symbol;
      operation.entryPrice =
        this.marketDataSelected.category === MarketDataCategory.STABLECOIN
          ? this.assetToSell.current_price!
          : this.marketDataSelected.current_price;
      operation.exitCoin = assetToExchange.symbol;
      if (this.operationType !== OperationsType.TRADING) {
        operation.exitPrice =
          this.marketDataSelected.category === MarketDataCategory.STABLECOIN
            ? this.assetToSell.current_price!
            : this.marketDataSelected.current_price;
      }
    }

    if (this.operationType !== OperationsType.TRANSFER) {
      operation.entryPriceValue = parseFloat(this.investedMoney.toFixed(2));
      operation.entryQuantity = this.assetNewBalance;
      if (this.operationType !== OperationsType.TRADING) {
        operation.exitDate = new Date(this.operationDate);
        operation.exitPriceValue = parseFloat(this.investedMoney.toFixed(2));
        operation.exitQuantity = this.investedMoney;
      }
    }

    let walletToSave = Utils.copyObject(this.wallet);

    if (this.operationType !== OperationsType.TRANSFER) {
      if (this.operationType === OperationsType.NEWINVESTMENT) {
        assetToBeSelled.operations = [operation];
        walletToSave.assets = [assetToBeSelled];
      } else {
        assetToExchange.operations = [operation];
        walletToSave.assets = [assetToExchange, assetToBeSelled];
      }
      this.saveWallet(walletToSave);
    } else {
      operation.exitCoin = operation.entryCoin;
      transferredAsset.operations = [operation];

      let walletSell = Utils.copyObject(this.wallet);
      let walletBuy = Utils.copyObject(this.walletToTansfer);

      walletSell.assets = [assetToBeSelled];
      walletBuy.assets = [transferredAsset];

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
    this.isEditSellBalance = false;
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

  calculateInvestment(invested: number, percentage: number) {
    const percentageToMoltiplicate = percentage / 100;
    return invested * percentageToMoltiplicate;
  }

  calculatePercentageInvested(currentBalance: number, sellingBalance: number) {
    if (currentBalance === 0) return 0; // Evita divisione per zero
    if (currentBalance === sellingBalance) return 100; // Se vendi tutto, è il 100%
    return ((currentBalance - sellingBalance) / currentBalance) * 100;
  }
}
