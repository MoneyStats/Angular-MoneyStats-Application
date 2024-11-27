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

@Component({
    selector: 'app-operation-details',
    templateUrl: './operation-details.component.html',
    styleUrls: ['./operation-details.component.scss'],
    standalone: false
})
export class OperationDetailsComponent implements OnInit, OnChanges {
  @Input('operation') operation?: Operation = new Operation();
  @Input('modalId') modalId: string = '';
  @Input('currency') currency: string = '';

  trend: number = 0;
  percentage: number = 0;

  constructor() {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  ngOnInit(): void {
    this.getTradingData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getTradingData();
  }

  getTradingData() {
    let currentPrice =
      this.operation?.entryQuantity! * this.operation?.asset?.current_price!;
    this.trend = this.operation?.trend
      ? this.operation.trend
      : parseFloat(
          (currentPrice - this.operation?.entryPriceValue!).toFixed(2)
        );
    this.percentage = this.operation?.performance
      ? this.operation.performance
      : parseFloat(
          (
            ((currentPrice - this.operation?.entryPriceValue!) / currentPrice) *
            100
          ).toFixed(2)
        );
  }
}
