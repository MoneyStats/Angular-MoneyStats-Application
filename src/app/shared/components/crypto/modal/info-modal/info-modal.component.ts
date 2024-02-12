import { Component, Input, OnInit } from '@angular/core';
import {
  ModalConstant,
  Operations,
  OperationsType,
} from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('isOperation') isOperation: boolean = false;
  @Input('isClosingOperation') isClosingOperation: boolean = false;
  @Input('operationType') operationType: string = '';
  operation = Operations;

  constructor() {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  ngOnInit(): void {}
}
