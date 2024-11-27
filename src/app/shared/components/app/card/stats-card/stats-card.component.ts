import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-stats-card',
    templateUrl: './stats-card.component.html',
    styleUrls: ['./stats-card.component.scss'],
    standalone: false
})
export class StatsCardComponent implements OnInit {
  @Input('title') title: string = 'Title';
  @Input('class') class: string = '';
  @Input('value') value: string = 'Value';

  constructor() {}

  ngOnInit(): void {}
}
