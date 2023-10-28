import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-card',
  templateUrl: './loading-card.component.html',
  styleUrls: ['./loading-card.component.scss'],
})
export class LoadingCardComponent implements OnInit {
  @Input('isThreeValue') isThreeValue: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
