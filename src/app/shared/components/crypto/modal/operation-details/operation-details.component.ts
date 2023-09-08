import { Component, Input, OnInit } from '@angular/core';
import { Operation } from 'src/assets/core/data/class/crypto.class';
import { OperationsType } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-operation-details',
  templateUrl: './operation-details.component.html',
  styleUrls: ['./operation-details.component.scss'],
})
export class OperationDetailsComponent implements OnInit {
  @Input('operation') operation?: Operation = new Operation();
  @Input('modalId') modalId: string = '';
  @Input('currency') currency: string = '';

  constructor() {}

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  ngOnInit(): void {
    console.log(this.operation);
  }
}
