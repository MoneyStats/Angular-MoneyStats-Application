import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.scss'],
})
export class CryptoDetailsComponent implements OnInit {
  @ViewChild('tradingView') tradingView?: ElementRef;
  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  asset: Asset = new Asset();

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private _renderer2: Renderer2
  ) {}

  ngOnInit(): void {
    let assets = this.cryptoService.getAssetList(
      this.cryptoService.cryptoDashboard.wallets
    );
    this.cryptoDashboard = this.cryptoService.cryptoDashboard;
    this.route.params.subscribe((a: any) => {
      this.asset = assets.find((as) => as.identifier == a.identifier)!;
    });
  }

  ngAfterViewInit(): void {
    this.appendGraph();
  }


  appendGraph() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.text = `
    {
      "symbols": [
        [
          "BINANCE:BTCUSDT|1D"
        ],
        [
          "FX:EURUSD|1D"
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
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
      ]
    }`;

    this.tradingView?.nativeElement.appendChild(script);
  }
}
