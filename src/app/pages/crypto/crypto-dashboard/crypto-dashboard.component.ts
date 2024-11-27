import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Dashboard, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { WalletService } from 'src/assets/core/services/api/wallet.service';

declare const TradingView: any;

@Component({
  selector: 'app-crypto-dashboard',
  templateUrl: './crypto-dashboard.component.html',
  styleUrls: ['./crypto-dashboard.component.scss'],
})
export class CryptoDashboardComponent implements OnInit, OnDestroy {
  getDashboardSubscribe: Subscription = new Subscription();
  getCryptoWalletSubscribe: Subscription = new Subscription();
  marketDataSubscribe: Subscription = new Subscription();
  walletsSubscribe: Subscription = new Subscription();

  filterMarketData: Array<any> = [];

  amount: string = '******';
  hidden: boolean = false;
  environment = environment;
  @ViewChild('tradingViewListCrypto') tradingViewListCrypto?: ElementRef;
  @ViewChild('tradingViewPrices') tradingViewPrices?: ElementRef;
  @ViewChild('tradingViewPricesScroll') tradingViewPricesScroll?: ElementRef;
  @ViewChild('selectGraph') selectGraph?: ElementRef;
  @ViewChild('dayGraph') dayGraph?: ElementRef;

  selectedSymbol: string = 'BTCUSDT';

  symbolList: Array<string> = [];

  @Output('wallets') wallets: Wallet[] = [];
  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  cryptoWallet?: Wallet[];
  assets: Asset[] = [];

  constructor(
    public screenService: ScreenService,
    private walletService: WalletService,
    private _renderer2: Renderer2,
    private cryptoService: CryptoService,
    private shared: SharedService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.getCryptoDashboard();
    ScreenService.showFooter();
  }

  ngAfterViewInit(): void {
    this.appendListGraph();
    this.appendPrices();
    this.appendSelectGraph(this.selectedSymbol);
    this.appendPricesScroll();
    this.appendDayGraph();
  }

  getCryptoDashboard() {
    this.getDashboardSubscribe = this.cryptoService
      .getCryptoDashboardData()
      .subscribe((data) => {
        this.cryptoService.cache.cacheCryptoDashboardData(data);
        LOG.info(data.message!, 'CryptoDashboardComponent');
        this.cryptoDashboard = data.data;
        this.shared.setCryptoDashboardData(data.data);
        this.assets = data.data.assets;
        this.getCoinForGraph();
        this.getMarketData();
      });
    this.isWalletBalanceHidden();
  }

  emitOperationClick(click: boolean) {
    this.getWalletsCryptoData();
  }

  getWalletsCryptoData() {
    if (Utils.isNullOrEmpty(this.cryptoWallet))
      this.getCryptoWalletSubscribe = this.cryptoService
        .getWalletsCryptoData()
        .subscribe((data) => {
          this.cryptoService.cache.cacheWalletsCryptoData(data);
          LOG.info(data.message!, 'CryptoDashboardComponent');
          const wallets = data.data;
          this.cryptoWallet = !Utils.isNullOrEmpty(wallets)
            ? wallets.filter((w: any) => w.category == 'Crypto')
            : [];
          this.shared.setCryptoWallets(this.cryptoWallet!);
        });
  }

  getWalletsData() {
    if (Utils.isNullOrEmpty(this.shared.getWallets()))
      this.walletsSubscribe = this.walletService
        .getWalletsData()
        .subscribe((data) => {
          this.walletService.cache.cacheWalletsData(data);
          LOG.info(data.message!, 'CryptoDashboardComponent');
          this.wallets = this.shared.setWallets(data.data);
        });
    else this.wallets = this.shared.getWallets();
  }

  vibrate() {
    Utils.vibrate();
  }

  getCoinForGraph() {
    this.symbolList = [];
    let assets = Utils.copyObject(this.assets);
    assets = assets.filter((a: any) => a.balance > 0 && a.symbol != 'USDT');
    assets.forEach((a: any) => this.symbolList.push(a.symbol + '-USDT'));
    if (this.symbolList.length == 0) this.symbolList.push('BTC-USDT');
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

  appendPricesScroll() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.text = `
    {
      "symbols": [
        {
          "proName": "FX_IDC:EURUSD",
          "title": "EUR/USD"
        },
        {
          "description": "Bitcoin",
          "proName": "BINANCE:BTCUSD"
        },
        {
          "description": "Ethereum",
          "proName": "BINANCE:ETHUSD"
        },
        {
          "description": "Crypto.com",
          "proName": "COINBASE:CROUSD"
        },
        {
          "description": "Binance Coin",
          "proName": "BINANCE:BNBUSD"
        },
        {
          "description": "Sandbox",
          "proName": "COINBASE:SANDUSD"
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "compact",
      "locale": "it"
    }`;

    this.tradingViewPricesScroll?.nativeElement.appendChild(script);
  }

  appendDayGraph() {
    let div = this._renderer2.createElement('div');
    div.style.height = '100%';
    div.id = 'selectSymbol1';
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
        "dateRange": "1D",
        "colorTheme": "dark",
        "isTransparent": true,
        "autosize": true,
        "largeChartUrl": ""
      }`;

    script.text = text.replace('$SYMBOL$', 'BTCUSDT');
    this._renderer2.appendChild(div, script);
    this._renderer2.appendChild(this.dayGraph?.nativeElement, div);
  }

  appendSelectGraph(symbol: string) {
    let div = this._renderer2.createElement('div');
    div.style.height = '100%';
    div.id = 'selectSymbol';
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;

    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    let text = `
    {
      "symbols": [
        [
          "$SYMBOL$|7D"
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
    this._renderer2.appendChild(this.selectGraph?.nativeElement, div);
    //this.selectGraph?.nativeElement.appendChild(script);
  }
  saveWallet(wallet: Wallet) {
    this.getCryptoDashboard();
  }
  hiddenShowAmount() {
    if (this.hidden) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
    localStorage.setItem(StorageConstant.HIDDENAMOUNT, this.hidden.toString());
  }

  isWalletBalanceHidden() {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }

  getMarketData() {
    this.marketDataSubscribe = this.cryptoService
      .getCryptoPriceData(this.cryptoDashboard.currency)
      .subscribe((data) => {
        this.cryptoService.cache.cacheMarketDataByCurrencyData(data);
        this.cryptoDashboard.lastUpdate = data.data[0].updateDate;
        this.filterMarketData = data.data;
      });
  }

  calculateTrend(balance: number, performance: number) {
    let oldBalance = balance / (1 + performance / 100);
    return parseFloat((balance - oldBalance).toFixed(2));
  }

  ngOnDestroy(): void {
    this.getDashboardSubscribe.unsubscribe();
    this.marketDataSubscribe.unsubscribe();
    this.getCryptoWalletSubscribe.unsubscribe();
    this.walletsSubscribe.unsubscribe();
  }
}
