import {
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { StorageConstant } from 'src/assets/core/data/constant/constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.scss'],
})
export class CryptoDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('tradingViewDetails') tradingViewDetails?: ElementRef;
  routeSubscribe: Subscription = new Subscription();
  detailsSubscribe: Subscription = new Subscription();
  cryptoDashSubscribe: Subscription = new Subscription();

  amount: string = '******';
  hidden: boolean = false;
  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  @Output('asset') asset: Asset = new Asset();
  @Output('assetName') assetName: string = '';

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private screenService: ScreenService,
    private logger: LoggerService,
    private _renderer2: Renderer2
  ) {}

  ngOnDestroy(): void {
    this.routeSubscribe.unsubscribe();
    this.detailsSubscribe.unsubscribe();
    this.cryptoDashSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.screenService.hideFooter();

    let assets = [...this.cryptoService.assets];
    //let assets = deepCopy(this.cryptoDashboard.assets);
    this.routeSubscribe = this.route.params.subscribe((a: any) => {
      this.assetName = a.identifier;
      if (assets.length != 0) {
        this.asset = assets.find((as) => as.identifier == a.identifier)!;
      } else this.getCryptoDetails(a.identifier);

      if (this.cryptoService.cryptoDashboard.balance != 0 && assets.length != 0)
        this.cryptoDashboard = deepCopy(this.cryptoService.cryptoDashboard);
      else this.getCryptoDashboard();
    });
    this.isWalletBalanceHidden();
  }

  ngAfterViewInit(): void {
    this.appendTradingViewDetails();
  }

  getCryptoDetails(identifier: string) {
    this.detailsSubscribe = this.cryptoService
      .getCryptoDetails(identifier)
      .subscribe((details) => {
        this.logger.LOG(details.message!, 'CryptoDetailsComponent');
        this.asset = details.data;
        this.cryptoService.asset = details.data;
      });
  }

  getCryptoDashboard() {
    this.cryptoDashSubscribe = this.cryptoService
      .getCryptoDashboardData()
      .subscribe((data) => {
        this.cryptoService.cache.cacheCryptoDashboardData(data);
        this.logger.LOG(data.message!, 'CryptoDetailsComponent');
        this.cryptoDashboard = data.data;
      });
  }

  isWalletBalanceHidden() {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }

  appendTradingViewDetails() {
    let div = this._renderer2.createElement('div');
    div.style.height = '100%';
    let symbol = this.asset.symbol!;
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    let text = `
    {
      "symbol": "$SYMBOL$USD",
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
