import { Component, Input, OnInit } from '@angular/core';
import { Operations } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-add-crypto-operation',
  templateUrl: './add-crypto-operation.component.html',
  styleUrls: ['./add-crypto-operation.component.scss'],
})
export class AddCryptoOperationComponent implements OnInit {
  @Input('isOperationSelected') isOperationSelected: boolean = false;

  operations: string[] = Operations;

  operationSelect: string = '';

  constructor() {}

  ngOnInit(): void {}
}
