import { Component, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { Operation } from 'src/assets/core/data/class/crypto.class';
import {
  MarketDataCategory,
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { Subscription } from 'rxjs';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { LOG } from 'src/assets/core/utils/log.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-close-operation',
  templateUrl: './close-operation.component.html',
  styleUrls: ['./close-operation.component.scss'],
  standalone: false,
})
export class CloseOperationComponent implements OnDestroy {
  closeSubscribe: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  @Input('operation') operation?: Operation = new Operation();
  @Input('walletsAsset') walletsAsset: Wallet[] = [];
  operationToClose: Operation = new Operation();
  cryptoCurrency: string = '';

  currentPrice: number = 0;
  isEditActive: boolean = false;
  isPercentageFee: boolean = false;
  closingDate: string = Utils.formatDate(new Date());

  fees: number = 0;
  percentageFees: number = 0;

  constructor(
    private cryptoService: CryptoService,
    private router: Router,
    private translate: TranslateService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  public get marktDataCategory(): typeof MarketDataCategory {
    return MarketDataCategory;
  }

  ngOnDestroy(): void {
    this.closeSubscribe.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.operation) this.getData();
  }

  getData() {
    if (
      !this.operation ||
      !this.operation!.type ||
      this.operation!.type != OperationsType.TRADING
    ) {
      return;
    }
    this.cryptoCurrency =
      UserService.getUserData().attributes.money_stats_settings.cryptoCurrency!;
    let currentPrice =
      this.operation?.entryQuantity! * this.operation?.asset?.current_price!;
    this.currentPrice = parseFloat(currentPrice.toFixed(2));
    let operation = Utils.copyObject(this.operation);
    //let operation = this.operation;
    operation!.exitDate = new Date(this.closingDate);
    operation!.exitPrice = operation?.asset?.current_price;
    operation!.exitPriceValue = parseFloat(currentPrice.toFixed(2));
    operation!.exitQuantity = parseFloat(currentPrice.toFixed(8));

    operation!.performance = parseFloat(
      (
        ((currentPrice - this.operation?.entryPriceValue!) / currentPrice) *
        100
      ).toFixed(2)
    );
    operation!.trend = parseFloat(
      (currentPrice - this.operation?.entryPriceValue!).toFixed(2)
    );
    this.operationToClose = operation;
  }

  refreshData() {
    let operation = this.operationToClose;
    let currentPrice =
      this.operationToClose?.entryQuantity! * this.operationToClose?.exitPrice!;

    // Calcolo delle fees in base alla scelta dell'utente
    let calculatedFees = this.isPercentageFee
      ? (this.percentageFees / 100) * currentPrice // Calcolo percentuale
      : this.fees; // Fees inserite manualmente

    // Se l'asset è una CRYPTOCURRENCY, usa il valore base 1, altrimenti moltiplica per exitPrice
    let fees =
      calculatedFees *
      (this.operationToClose.asset?.category ===
      MarketDataCategory.CRYPTOCURRENCY
        ? 1
        : this.operationToClose?.exitPrice!);

    // Calcoli finali
    operation!.exitPriceValue = parseFloat((currentPrice - fees).toFixed(2));
    operation!.exitQuantity = parseFloat((currentPrice - fees).toFixed(8));
    operation!.performance = parseFloat(
      (
        ((currentPrice - this.operationToClose?.entryPriceValue!) /
          currentPrice) *
        100
      ).toFixed(2)
    );
    operation!.trend = parseFloat(
      (currentPrice - fees - this.operationToClose?.entryPriceValue!).toFixed(2)
    );
  }

  updateExitPrice() {
    this.operationToClose.exitPriceValue = parseFloat(
      this.operationToClose.exitQuantity?.toFixed(2)!
    );
  }

  validateClosingDate() {
    const closingDate = new Date(this.closingDate);
    const entryDate = new Date(this.operationToClose.entryDate!);
    if (entryDate >= closingDate) return true;
    this.operationToClose.exitDate = closingDate;
    return false;
  }

  closeOperation() {
    this.operationToClose!.status = 'CLOSED';
    const wallets = Utils.copyObject(this.walletsAsset);
    let wallet = wallets.find(
      (w: any) =>
        w.assets != undefined &&
        w.assets.find(
          (a: any) =>
            a.operations != undefined &&
            a.operations.find((o: any) => o.id == this.operation?.id)
        )
    );
    //let wallet = this.operation?.wallet;
    let asset1 = wallet?.assets.find(
      (a: any) => a.symbol == this.operationToClose?.exitCoin
    );
    let asset2 = wallet?.assets.find(
      (a: any) => a.symbol == this.operationToClose?.entryCoin
    );
    this.operationToClose.asset = undefined;
    this.operationToClose.assetSell = undefined;
    this.operationToClose.wallet = undefined;

    let fees = parseFloat(
      (this.fees * this.operationToClose?.exitPrice!).toFixed(8)
    );
    if (this.operationToClose.fees) this.operationToClose.fees! += fees;
    else this.operationToClose.fees = fees;

    const percentageInvested = this.calculatePercentageInvested(
      asset1.balance,
      this.operationToClose?.entryQuantity!
    );

    const investedToTransfer = this.calculateInvestment(
      asset1.invested,
      percentageInvested
    );
    // Aggiorna gli investimenti
    asset1!.invested = Math.max(0, asset1!.invested - investedToTransfer);
    asset2!.invested += investedToTransfer;

    asset1!.operations = [this.operationToClose];
    asset1!.balance -= this.operationToClose?.entryQuantity!;
    //asset1!.invested -= this.operationToClose?.entryPriceValue!;
    //asset1!.invested = asset1!.invested < 0 ? 0 : asset1!.invested;
    asset1!.updateDate = new Date();
    asset2!.balance += this.operationToClose?.exitQuantity!;
    //asset2!.invested += this.operationToClose?.entryPriceValue!;
    //asset2!.invested = asset2!.invested < 0 ? 0 : asset2!.invested;
    asset2!.updateDate = new Date();

    wallet!.assets = [asset1!, asset2!];
    console.log(asset1, asset2);
    this.closeSubscribe = this.cryptoService
      .updateCryptoAsset(wallet!)
      .subscribe((data) => {
        LOG.info(data.message!, 'CloseOperationComponent');
        SwalService.toastMessage(
          SwalIcon.SUCCESS,
          this.translate.instant('response.close')
        );
        this.router.navigate(['/crypto/dashboard']);
      });
  }

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
