import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';

@Component({
  selector: 'app-operations-modal',
  templateUrl: './operations-modal.component.html',
  styleUrls: ['./operations-modal.component.scss'],
})
export class OperationsModalComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('wallets') wallets: Wallet[] = [];
  @Input('assets') assets: Asset[] = [];
  @Input('currency') currency: string = '';

  isAddStatsSelected: boolean = false;

  currentIndex: number = 0;

  constructor() {}

  ngOnInit(): void {}

  changeAsset() {
    this.currentIndex += 1;
  }

  filterWallets(wallets: Wallet[], assetName: string): Wallet[] {
    let wallAsset = wallets.filter((w) =>
      w.assets.find((a) => a.name == assetName)
    );
    /*wallAsset.forEach((w) => {
      w.assets = w.assets.filter((a) => a.name == assetName);
    });*/
    return wallAsset;
  }
}
