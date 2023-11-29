import {
  Component,
  ElementRef,
  Input,
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
  @ViewChild('tradingViewDetails') tradingViewDetails?: ElementRef;
  @Input('symbol') symbol: string = '';

  constructor(private _renderer2: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.appendTradingViewAdvanced();
    this.appendTradingViewDetails();
  }

  appendTradingViewAdvanced() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.text = `
    {
      "autosize": true,
      "symbol": "BINANCE:BTCUSDT",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "it",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "withdateranges": true,
      "allow_symbol_change": true,
      "container_id": "tradingview_39b4d"
    }`;

    this.tradingViewAdvanced?.nativeElement.appendChild(script);
  }

  appendTradingViewDetails() {
    let div = this._renderer2.createElement('div');
    div.style.height = '100%';
    let symbol = this.symbol;
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    let text = `
    {
      "symbol": "BINANCE:$SYMBOL$USD",
      "width": "100%",
      "locale": "it",
      "colorTheme": "dark",
      "isTransparent": true
    }
    `;

    script.text = text.replace('$SYMBOL$', symbol);
    this._renderer2.appendChild(div, script);
    this._renderer2.appendChild(this.tradingViewDetails?.nativeElement, div);
  }
}
