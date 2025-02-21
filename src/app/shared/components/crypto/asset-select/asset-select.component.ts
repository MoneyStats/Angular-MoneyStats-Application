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
import { SelectAssetConstant } from 'src/assets/core/data/constant/constant';
import { Utils } from 'src/assets/core/services/config/utils.service';

declare var jQuery: any;

@Component({
    selector: 'app-asset-select',
    templateUrl: './asset-select.component.html',
    styleUrls: ['./asset-select.component.scss'],
    standalone: false
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

  constructor() {}

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
      this.assetSelected = Utils.copyObject(this.cryptoPrices[0]);
      this.emitSelectAsset.emit(this.assetSelected);
    }
    if (this.wrapperID == SelectAssetConstant.TRANSFER)
      this.filterCryptoPrices = this.filterCryptoPrices.filter(
        (asset) => asset.balance > 0
      );
  }

  openCloseSelect() {
    let select = document.getElementById(this.wrapperID);
    if (select?.classList.contains('active')) {
      select.classList.remove('active');
    } else select?.classList.add('active');
  }
}
