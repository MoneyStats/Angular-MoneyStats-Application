import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-title-desktop',
    templateUrl: './title-desktop.component.html',
    styleUrls: ['./title-desktop.component.scss'],
    standalone: false
})
export class TitleDesktopComponent implements OnInit {
  @Input('title') title?: string;
  @Input('back') back?: string;

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }
}
