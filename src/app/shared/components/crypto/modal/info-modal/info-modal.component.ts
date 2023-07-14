import { Component, Input, OnInit } from '@angular/core';
import { ModalConstant } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('isOperation') isOperation: boolean = false;
  @Input('isNewInvestment') isNewInvestment: boolean = false;

  constructor() {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}
}
