import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

declare const TradingView: any;

@Component({
  selector: 'app-crypto-dashboard',
  templateUrl: './crypto-dashboard.component.html',
  styleUrls: ['./crypto-dashboard.component.scss'],
})
export class CryptoDashboardComponent implements OnInit {
  @ViewChild('tradingViewListCrypto') tradingViewListCrypto?: ElementRef;
  @ViewChild('tradingViewPrices') tradingViewPrices?: ElementRef;
  @ViewChild('selectGraph') selectGraph?: ElementRef;

  selectedSymbol: string = 'BTCUSDT';

  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  assets: Asset[] = [];

  constructor(
    public screenService: ScreenService,
    private _renderer2: Renderer2,
    private cryptoService: CryptoService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDashboard();
    this.screenService.setupHeader();
  }

  ngAfterViewInit(): void {
    this.appendListGraph();
    this.appendPrices();
    this.appendSelectGraph(this.selectedSymbol);
  }

  getDashboard() {
    this.cryptoService.getCryptoDashboard().subscribe((data) => {
      this.cryptoDashboard = data.data;
      this.assets = this.getAssetList(this.cryptoDashboard.wallets);
    });
  }

  getAssetList(wallets: Wallet[]): Asset[] {
    let allAssets: Array<Asset> = [];
    wallets.forEach((wallet) => {
      wallet.assets.forEach((asset) => {
        if (allAssets.find((a) => a.name == asset.name)) {
          const index = allAssets.indexOf(
            allAssets.find((a) => a.name == asset.name)!
          );
          allAssets[index].balance! += asset.balance!;
          allAssets[index].value! += asset.value!;
          allAssets[index].performance! =
            (allAssets[index].performance! + asset.performance!) / 2;

          // TODO: Add also operation
          asset.operations.forEach((o) => {
            allAssets[index].operations.push(o);
          });
          allAssets[index].operations.sort((o) =>
            o.exitDate != undefined ? o.exitDate : o.entryDate
          );
        } else allAssets.push(asset);
      });
    });
    return allAssets;
  }

  onChange(symbol: string) {
    document.getElementById('selectSymbol')?.remove();
    this.appendSelectGraph(symbol);
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

    this.tradingViewListCrypto?.nativeElement.appendChild(script);
  }

  appendPrices() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
    script.text = `
    {
      "symbols": [
        {
          "proName": "BINANCE:BTCUSDT",
          "title": "Bitcoin"
        },
        {
          "proName": "BINANCE:ETHUSDT",
          "title": "Ethereum"
        },
        {
          "proName": "BINANCE:BNBUSDT",
          "title": "Binance Coin"
        },
        {
          "proName": "CROUSDT",
          "title": "Crypto.com"
        },
        {
          "proName": "BINANCE:SANDUSDT",
          "title": "Sandbox"
        },
        {
          "proName": "FX_IDC:EURUSD",
          "title": "EUR/USD"
        }
      ],
      "colorTheme": "dark",
      "isTransparent": true,
      "showSymbolLogo": true,
      "locale": "it"
    }`;

    this.tradingViewPrices?.nativeElement.appendChild(script);
  }

  appendSelectGraph(symbol: string) {
    let div = this._renderer2.createElement('div');
    div.style.height = '100%';
    div.id = 'selectSymbol';
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';

    let text = `
      {
        "container_id": "test",
        "symbol": "$SYMBOL$",
        "width": "100%",
        "height": "100%",
        "locale": "it",
        "dateRange": "1M",
        "colorTheme": "dark",
        "isTransparent": true,
        "autosize": true,
        "largeChartUrl": ""
      }`;

    script.text = text.replace('$SYMBOL$', symbol);
    this._renderer2.appendChild(div, script);
    this._renderer2.appendChild(this.selectGraph?.nativeElement, div);
    //this.selectGraph?.nativeElement.appendChild(script);
  }
}
