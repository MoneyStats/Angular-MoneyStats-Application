import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-content-box',
    templateUrl: './content-box.component.html',
    styleUrls: ['./content-box.component.scss'],
    standalone: false
})
export class ContentBoxComponent implements OnInit {
  @Input('header') header?: string;
  @Input('body') body?: string;
  @Input('footer') footer?: string;

  constructor() {}

  ngOnInit(): void {}
}
