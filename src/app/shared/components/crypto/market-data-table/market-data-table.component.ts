import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-market-data-table',
  templateUrl: './market-data-table.component.html',
  styleUrls: ['./market-data-table.component.scss'],
  standalone: false,
})
export class MarketDataTableComponent implements OnInit, OnChanges {
  @Input('filterMarketData') filterMarketData: Array<any> = [];
  @Input('limit') limit: number = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    if (this.limit != 0)
      this.filterMarketData.splice(this.limit, this.filterMarketData.length);
  }
}
