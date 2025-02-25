import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-tradingview-data',
    templateUrl: './tradingview-data.component.html',
    styleUrls: ['./tradingview-data.component.scss'],
    standalone: false
})
export class TradingviewDataComponent implements OnChanges {
  @ViewChild('tradingView') tradingView?: ElementRef;
  @ViewChild('tradingViewTechnicalAnalisys')
  tradingViewTechnicalAnalisys?: ElementRef;
  @ViewChild('tradingViewAssetInfo')
  tradingViewAssetInfo?: ElementRef;
  @ViewChild('tradingViewListCryptos') tradingViewListCryptos?: ElementRef;
  @ViewChild('tradingViewMap') tradingViewMap?: ElementRef;

  @Input('assetSymbol') assetSymbol: string = 'BTC';

  constructor(private _renderer2: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    if (this.assetSymbol) {
      this.appendGraph();
      this.appendTradingViewTechnicalAnalisys();
      this.appendTradingViewAssetInfo();
      this.appendListGraph();
      this.appendTradingViewMap();
    }
  }

  appendGraph() {
    let div = this._renderer2.createElement('div');
    div.style.height = '100%';
    let symbol = this.assetSymbol;
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    let text = `
    {
      "symbols": [
        [
          "$SYMBOL$USDT|7D"
        ],
        [
          "FX:EURUSD|7D"
        ]
      ],
      "chartOnly": false,
      "width": "100%",
      "height": "100%",
      "locale": "it",
      "colorTheme": "dark",
      "autosize": true,
      "showVolume": false,
      "showMA": false,
      "hideDateRanges": false,
      "hideMarketStatus": false,
      "hideSymbolLogo": false,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      "fontSize": "10",
      "noTimeScale": false,
      "valuesTracking": "1",
      "changeMode": "price-and-percent",
      "chartType": "area",
      "maLineColor": "#2962FF",
      "maLineWidth": 1,
      "maLength": 9,
      "backgroundColor": "rgba(19, 23, 34, 0)",
      "lineWidth": 2,
      "lineType": 0,
      "dateRanges": [
        "1d|1",
        "1w|15",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
      ]
    }`;

    script.text = text.replace('$SYMBOL$', symbol);
    this._renderer2.appendChild(div, script);
    this._renderer2.appendChild(this.tradingView?.nativeElement, div);
  }

  appendTradingViewTechnicalAnalisys() {
    let div = this._renderer2.createElement('div');
    div.style.height = '100%';
    let symbol = this.assetSymbol;
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    let text = `
    {
      "interval": "1D",
      "width": "100%",
      "isTransparent": true,
      "height": "100%",
      "symbol": "$SYMBOL$USD",
      "showIntervalTabs": true,
      "locale": "it",
      "colorTheme": "dark"
    }`;

    script.text = text.replace('$SYMBOL$', symbol);
    this._renderer2.appendChild(div, script);
    this._renderer2.appendChild(
      this.tradingViewTechnicalAnalisys?.nativeElement,
      div
    );
  }

  appendTradingViewAssetInfo() {
    let div = this._renderer2.createElement('div');
    div.style.height = '100%';
    let symbol = this.assetSymbol;
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
    let text = `
    {
      "width": "100%",
      "height": "100%",
      "colorTheme": "dark",
      "isTransparent": true,
      "symbol": "$SYMBOL$USD",
      "locale": "it"
    }`;

    script.text = text.replace('$SYMBOL$', symbol);
    this._renderer2.appendChild(div, script);
    this._renderer2.appendChild(this.tradingViewAssetInfo?.nativeElement, div);
  }

  appendListGraph() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.text = `
    {
      "width": "100%",
      "height": "100%",
      "defaultColumn": "overview",
      "screener_type": "crypto_mkt",
      "displayCurrency": "USD",
      "colorTheme": "dark",
      "locale": "it",
      "isTransparent": true
    }`;

    this.tradingViewListCryptos?.nativeElement.appendChild(script);
  }

  appendTradingViewMap() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.async = true;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
    script.innerHTML = `
    {
      "dataSource": "Crypto",
      "blockSize": "market_cap_calc",
      "blockColor": "change",
      "locale": "it",
      "symbolUrl": "",
      "colorTheme": "dark",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": false,
      "hasSymbolTooltip": false,
      "width": "100%",
      "height": "100%"
    }`;

    this.tradingViewMap?.nativeElement.appendChild(script);
  }
}
