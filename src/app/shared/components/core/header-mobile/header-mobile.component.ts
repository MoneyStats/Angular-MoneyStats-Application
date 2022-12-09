import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit {
  @Input('backBtn') backBtn: string = '';
  @Input('title') title: string = '';
  @Input('rightBtn') rightBtn: string = '';

  constructor() {}

  ngOnInit(): void {}
}
