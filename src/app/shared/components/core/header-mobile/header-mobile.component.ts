import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ModalConstant } from 'src/assets/core/data/constant/modal.constant';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit {
  @Input('backBtn') backBtn: string = '';
  @Input('title') title: string = '';
  @Input('rightBtn') rightBtn: string = '';
  @Input('dataBsTarget') dataBsTarget: string = '';
  @Input('restore') restore: boolean = false;

  constructor(private location: Location) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }
}
