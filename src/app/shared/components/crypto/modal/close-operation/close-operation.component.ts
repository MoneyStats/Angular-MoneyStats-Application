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
  selector: 'app-close-operation',
  templateUrl: './close-operation.component.html',
  styleUrls: ['./close-operation.component.scss'],
})
export class CloseOperationComponent implements OnInit, OnChanges {
  @Input('modalId') modalId: string = '';
  @Input('operation') operation?: Operation = new Operation();

  currentPrice: number = 0;

  constructor() {}

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
    let currentPrice =
      this.operation?.entryQuantity! * this.operation?.asset?.current_price!;
    this.currentPrice = parseFloat(currentPrice.toFixed(2));
  }
}
