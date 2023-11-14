import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { SelectAssetConstant } from 'src/assets/core/data/constant/constant';

declare var jQuery: any;

@Component({
  selector: 'app-asset-select',
  templateUrl: './asset-select.component.html',
  styleUrls: ['./asset-select.component.scss'],
})
export class AssetSelectComponent implements OnInit, OnChanges {
  @Input('wrapperID') wrapperID: string = '';
  @Input('fiat') cryptoCurrency: string = '';
  @Input('isOperation') isOperation: boolean = false;

  @Output('emitSelectAsset') emitSelectAsset = new EventEmitter<Asset>();

  filterCryptoPrices: Asset[] = [];
  @Input('cryptoPrices') cryptoPrices: Asset[] = [];

  search: string = '';
  // Change the value of the asset
  assetSelected?: Asset;
  isFilterActive: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private logger: LoggerService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.getCryptoPrices();
  }

  ngOnInit(): void {
    this.getCryptoPrices();
  }

  selectAssetInput(name: string) {
    this.search = '';
    this.isFilterActive = false;
    this.assetSelected = this.filterCryptoPrices
      .slice()
      .find((a) => a.name == name);
    this.emitSelectAsset.emit(this.assetSelected);
    this.openCloseSelect();
  }

  onKeySearch(event: any) {
    setTimeout(() => {
      this.filterCryptoPrice(this.search);
    }, 10);
  }

  filterCryptoPrice(filter: string) {
    this.filterCryptoPrices = this.cryptoPrices.filter(
      (cp) =>
        cp.name?.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
        cp.symbol?.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    );
  }

  getCryptoPrices() {
    if (this.cryptoPrices && this.cryptoPrices.length > 0) {
      this.filterCryptoPrices = this.cryptoPrices.slice();
      this.assetSelected = deepCopy(this.cryptoPrices[0]);
      this.emitSelectAsset.emit(this.assetSelected);
    }
    if (this.wrapperID == SelectAssetConstant.TRANSFER)
      this.filterCryptoPrices = this.filterCryptoPrices.filter(
        (asset) => asset.balance > 0
      );
    /*else {
      this.cryptoService
        .getCryptoPrice(this.cryptoCurrency)
        .subscribe((data) => {
          this.logger.LOG(data.message!, 'AssetSelectComponent');
          this.cryptoPrices = data.data;
          this.filterCryptoPrices = data.data;
          this.assetSelected = data.data[0];
          this.emitSelectAsset.emit(this.assetSelected);
        });
    }*/
  }

  openCloseSelect() {
    let select = document.getElementById(this.wrapperID);
    if (select?.classList.contains('active')) {
      select.classList.remove('active');
    } else select?.classList.add('active');
  }
}
