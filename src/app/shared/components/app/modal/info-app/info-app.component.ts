import { Component, Input, OnInit } from '@angular/core';
import { ModalConstant } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-info-app',
  templateUrl: './info-app.component.html',
  styleUrls: ['./info-app.component.scss'],
})
export class InfoAppComponent implements OnInit {
  @Input('modalId') modalId: string = '';

  constructor() {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}
}
