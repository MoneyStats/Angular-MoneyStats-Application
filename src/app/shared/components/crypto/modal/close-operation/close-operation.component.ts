import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Operation } from 'src/assets/core/data/class/crypto.class';
import {
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { Router } from '@angular/router';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';

@Component({
  selector: 'app-close-operation',
  templateUrl: './close-operation.component.html',
  styleUrls: ['./close-operation.component.scss'],
})
export class CloseOperationComponent implements OnInit, OnChanges {
  @Input('modalId') modalId: string = '';
  @Input('operation') operation?: Operation = new Operation();
  cryptoCurrency: string = '';

  currentPrice: number = 0;
  isEditActive: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private swal: SwalService,
    private router: Router
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getData();
  }

  getData() {
    if (this.operation!.type != OperationsType.TRADING) {
      return;
    }

    this.cryptoCurrency = this.cryptoService.cryptoDashboard.currency;
    let currentPrice =
      this.operation?.entryQuantity! * this.operation?.asset?.current_price!;
    this.currentPrice = parseFloat(currentPrice.toFixed(2));
    let operation = this.operation;
    operation!.exitDate = new Date();
    operation!.exitPrice = operation?.asset?.current_price;
    operation!.exitPriceValue = parseFloat(currentPrice.toFixed(2));
    operation!.exitQuantity = parseFloat(
      (
        operation!.entryPriceValue! / operation!.assetSell!.current_price!
      ).toFixed(8)
    );

    operation!.performance = parseFloat(
      (
        ((currentPrice - this.operation?.entryPriceValue!) / currentPrice) *
        100
      ).toFixed(2)
    );
    operation!.trend = parseFloat(
      (currentPrice - this.operation?.entryPriceValue!).toFixed(2)
    );
  }

  refreshData() {
    let operation = this.operation;
    let currentPrice =
      this.operation?.entryQuantity! * this.operation?.exitPrice!;
    operation!.performance = parseFloat(
      (
        ((currentPrice - this.operation?.entryPriceValue!) / currentPrice) *
        100
      ).toFixed(2)
    );
    operation!.trend = parseFloat(
      (currentPrice - this.operation?.entryPriceValue!).toFixed(2)
    );
    this.isEditActive = false;
  }

  closeOperation() {
    this.operation!.status = 'CLOSED';
    let dashboard = deepCopy(this.cryptoService.cryptoDashboard);
    let wallet = dashboard.wallets.find(
      (w) =>
        w.assets != undefined &&
        w.assets.find(
          (a) =>
            a.operations != undefined &&
            a.operations.find((o) => o.id == this.operation?.id)
        )
    );
    //let wallet = this.operation?.wallet;
    let asset1 = wallet?.assets.find(
      (a) => a.symbol == this.operation?.exitCoin
    );
    let asset2 = wallet?.assets.find(
      (a) => a.symbol == this.operation?.entryCoin
    );
    this.operation!.asset = undefined;
    this.operation!.assetSell = undefined;
    this.operation!.wallet = undefined;

    asset1!.operations = [this.operation];
    asset1!.balance -= this.operation?.entryQuantity!;
    asset1!.invested -= this.operation?.entryPriceValue!;
    asset1!.updateDate = new Date();

    asset2!.balance += this.operation?.exitQuantity!;
    asset2!.invested += this.operation?.entryPriceValue!;
    asset2!.updateDate = new Date();

    wallet!.assets = [asset1!, asset2!];
    let message =
      'Operation ' +
      asset2?.symbol +
      '/' +
      asset1?.symbol +
      ' successfully closed';
    this.cryptoService.addOrUpdateCryptoAsset(wallet!).subscribe((data) => {
      this.swal.toastMessage(SwalIcon.SUCCESS, message);
      this.router.navigate(['/crypto/dashboard']);
    });
  }
}
