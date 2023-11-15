import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

@Component({
  selector: 'app-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.scss'],
})
export class MarketDataComponent implements OnInit, OnDestroy {
  marketDataSubscribe: Subscription = new Subscription();
  cryptoCurrency?: string;
  marketData: Array<any> = [];
  updateDate?: Date;

  search: string = '';
  filterMarketData: Array<any> = [];

  constructor(
    private cryptoService: CryptoService,
    private route: ActivatedRoute,
    private screenService: ScreenService
  ) {}
  
  ngOnDestroy(): void {
    this.marketDataSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.getMarketData();
  }

  getMarketData() {
    this.route.params.subscribe((a: any) => {
      this.cryptoCurrency = a.currency;
      this.marketDataSubscribe = this.cryptoService
        .getCryptoPrice(a.currency)
        .subscribe((data) => {
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
}
