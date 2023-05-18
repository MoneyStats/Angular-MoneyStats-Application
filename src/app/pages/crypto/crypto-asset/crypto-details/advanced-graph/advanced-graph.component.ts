import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-advanced-graph',
  templateUrl: './advanced-graph.component.html',
  styleUrls: ['./advanced-graph.component.scss'],
})
export class AdvancedGraphComponent implements OnInit {
  @ViewChild('tradingViewAdvanced') tradingViewAdvanced?: ElementRef;

  constructor(private _renderer2: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.appendTradingViewAdvanced();
  }

  appendTradingViewAdvanced() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.text = `
    {
      "autosize": true,
      "symbol": "BINANCE:BTCUSD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "it",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "withdateranges": true,
      "allow_symbol_change": true,
      "container_id": "tradingview_c4cd6"
    }`;

    this.tradingViewAdvanced?.nativeElement.appendChild(script);
  }
}
