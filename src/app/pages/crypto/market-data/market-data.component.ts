import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CryptoDashboard } from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.scss'],
  standalone: false,
})
export class MarketDataComponent implements OnInit, OnDestroy {
  getDashboardSubscribe: Subscription = new Subscription();
  marketDataSubscribe: Subscription = new Subscription();
  getCryptoWalletSubscribe: Subscription = new Subscription();

  cryptoCurrency?: string;
  marketData: Array<any> = [];
  updateDate?: Date;

  search: string = '';
  filterMarketData: Array<any> = [];

  @Output('cryptoDashboard') cryptoDashboard: CryptoDashboard =
    new CryptoDashboard();
  @Output('cryptoWallets') cryptoWallets: Array<Wallet> = [];

  constructor(
    private cryptoService: CryptoService,
    private route: ActivatedRoute,
    private shared: SharedService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.marketDataSubscribe.unsubscribe();
    this.getDashboardSubscribe.unsubscribe();
    this.getCryptoWalletSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    ScreenService.hideFooter();
    this.getMarketData();
  }

  getMarketData() {
    this.route.params.subscribe((a: any) => {
      this.cryptoCurrency = a.currency;
      this.marketDataSubscribe = this.cryptoService
        .getCryptoPriceData(a.currency)
        .subscribe((data) => {
          this.cryptoService.cache.cacheMarketDataByCurrencyData(data);
          LOG.info(data.message!, 'MarketDataComponent');
          this.marketData = data.data;
          this.updateDate = this.marketData[0].updateDate;
          this.filterMarketData = data.data;
        });
    });
  }

  onKeySearch(event: any) {
    setTimeout(() => {
      this.filterMarketDatas(this.search);
    }, 10);
  }

  filterMarketDatas(filter: string) {
    this.filterMarketData = this.marketData.filter(
      (cp) =>
        cp.name?.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
        cp.symbol?.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    );
  }

  emitOperationClick(click: boolean) {
    this.getDashboard();
    this.getWalletsCryptoData();
  }

  getDashboard() {
    if (Utils.isNullOrEmpty(this.shared.getCryptoDashboardData()))
      this.getDashboardSubscribe = this.cryptoService
        .getCryptoDashboardData()
        .subscribe((data) => {
          this.cryptoService.cache.cacheCryptoDashboardData(data);
          LOG.info(data.message!, 'MarketDataComponent');
          this.cryptoDashboard = this.shared.setCryptoDashboardData(data.data);
        });
    else this.cryptoDashboard = this.shared.getCryptoDashboardData();
  }

  getWalletsCryptoData() {
    if (Utils.isNullOrEmpty(this.shared.getCryptoWallets()))
      this.getCryptoWalletSubscribe = this.cryptoService
        .getWalletsCryptoData()
        .subscribe((data) => {
          this.cryptoService.cache.cacheWalletsCryptoData(data);
          LOG.info(data.message!, 'MarketDataComponent');
          this.cryptoWallets = this.shared.setCryptoWallets(data.data);
        });
    else this.cryptoWallets = this.shared.getCryptoWallets();
  }
}
