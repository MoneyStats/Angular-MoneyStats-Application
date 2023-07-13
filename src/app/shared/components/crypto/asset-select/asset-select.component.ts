import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';

declare var jQuery: any;

@Component({
  selector: 'app-asset-select',
  templateUrl: './asset-select.component.html',
  styleUrls: ['./asset-select.component.scss'],
})
export class AssetSelectComponent implements OnInit {
  @Input('wrapperID') wrapperID: string = '';
  @Input('fiat') cryptoCurrency: string = '';
  @Input('isOperation') isOperation: boolean = false;

  @Output('emitSelectAsset') emitSelectAsset = new EventEmitter<Asset>();

  filterCryptoPrices: Asset[] = [];
  cryptoPrices: Asset[] = [];

  search: string = '';
  // Change the value of the asset
  assetSelected?: Asset;
  isFilterActive: boolean = false;

  constructor(private cryptoService: CryptoService) {}

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
      (cp) => cp.name?.includes(filter) || cp.symbol?.includes(filter)
    );
  }

  getCryptoPrices() {
    this.cryptoService.getCryptoPrice(this.cryptoCurrency).subscribe((data) => {
      this.cryptoPrices = data.data;
      this.filterCryptoPrices = data.data;
      this.assetSelected = data.data[0];
      this.emitSelectAsset.emit(this.assetSelected);
    });
  }

  isFilterAc() {
    console.log('hU');
    this.isFilterActive = true;
  }

  openCloseSelect() {
    let select = document.getElementById(this.wrapperID);
    console.log('CLICK', select, this.wrapperID);
    if (select?.classList.contains('active')) {
      select.classList.remove('active');
    } else select?.classList.add('active');
  }
}
