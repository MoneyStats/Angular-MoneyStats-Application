import { Component, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { Operation } from 'src/assets/core/data/class/crypto.class';
import {
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { Router } from '@angular/router';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { Subscription } from 'rxjs';
import { LOG } from 'src/assets/core/utils/log.service';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';

@Component({
  selector: 'app-close-operation',
  templateUrl: './close-operation.component.html',
  styleUrls: ['./close-operation.component.scss'],
})
export class CloseOperationComponent implements OnDestroy {
  closeSubscribe: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  @Input('operation') operation?: Operation = new Operation();
  operationToClose: Operation = new Operation();
  cryptoCurrency: string = '';

  currentPrice: number = 0;
  isEditActive: boolean = false;

  fees: number = 0;

  constructor(
    private cryptoService: CryptoService,
    private router: Router,
    private translate: TranslateService,
    private shared: SharedService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
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
    this.cryptoCurrency = UserService.getUserData().settings.cryptoCurrency!;
    let currentPrice =
      this.operation?.entryQuantity! * this.operation?.asset?.current_price!;
    this.currentPrice = parseFloat(currentPrice.toFixed(2));
    let operation = Utils.copyObject(this.operation);
    //let operation = this.operation;
    operation!.exitDate = new Date();
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
    let fees = this.fees * this.operationToClose?.exitPrice!;
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
    //this.isEditActive = false;
  }

  updateExitPrice() {
    this.operationToClose.exitPriceValue = parseFloat(
      this.operationToClose.exitQuantity?.toFixed(2)!
    );
  }

  closeOperation() {
    this.operationToClose!.status = 'CLOSED';
    let dashboard = Utils.copyObject(this.shared.getCryptoDashboardData());
    let wallet = dashboard.wallets.find(
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

    asset1!.operations = [this.operationToClose];
    asset1!.balance -= this.operationToClose?.entryQuantity!;
    asset1!.invested -= this.operationToClose?.entryPriceValue!;
    asset1!.updateDate = new Date();

    asset2!.balance += this.operationToClose?.exitQuantity!;
    asset2!.invested += this.operationToClose?.entryPriceValue!;
    asset2!.updateDate = new Date();

    wallet!.assets = [asset1!, asset2!];

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
}
