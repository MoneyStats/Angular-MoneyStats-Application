import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import { Asset, Operation } from 'src/assets/core/data/class/crypto.class';
import { v4 as uuidv4 } from 'uuid';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { Router } from '@angular/router';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { UserService } from 'src/assets/core/services/api/user.service';

@Component({
  selector: 'app-operations-list',
  templateUrl: './operations-list.component.html',
  styleUrls: ['./operations-list.component.scss'],
  standalone: false,
})
export class OperationsListComponent implements OnInit, OnChanges {
  @Input('walletsAsset') walletsAsset: Wallet[] = [];
  @Input('cryptoAssets') cryptoAssets: Asset[] = [];
  @Input('isAssetOperations') isAssetOperations: boolean = false;

  // Input full list
  @Input('operationsMapByYear') operationsMapByYear: Map<string, any[]> =
    new Map<string, any[]>();
  @Input('year') year: string = '';

  @Input('isFullList') isFullList: boolean = false;
  @Input('modalID') modalID: string = uuidv4();

  @Output('operationSelect') operationSelect: any;

  cryptoCurrency?: string =
    UserService.getUserData().attributes.money_stats_settings.cryptoCurrency;

  operations: Operation[] = [];
  constructor(private cryptoService: CryptoService, private router: Router) {}

  public get operationTypeConstant(): typeof OperationsType {
    return OperationsType;
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getOperations();
  }

  getOperations() {
    let assets = Utils.isNullOrEmpty(this.cryptoAssets)
      ? this.cryptoService.getAssetList(this.walletsAsset)
      : this.cryptoAssets;
    let operations: Operation[] = [];
    let wallets = Utils.copyObject(this.walletsAsset);
    wallets.forEach((wallet: any) => {
      if (wallet.assets && wallet.assets.length > 0)
        wallet.assets.forEach((asset: any) => {
          if (asset.operations && asset.operations.length > 0)
            asset.operations.forEach((operation: any) => {
              operation.asset = asset;
              operation.wallet = wallet;
              if (operation.type != OperationsType.NEWINVESTMENT) {
                operation.assetSell = Utils.copyObject(
                  assets.find((a) => a.symbol == operation.entryCoin)
                );
              }
              operations.push(operation);
            });
        });
    });
    operations = operations.sort((a, b) =>
      a.exitDate && b.exitDate
        ? a.exitDate! < b.exitDate!
          ? 1
          : -1
        : a.entryDate! < b.entryDate!
        ? 1
        : -1
    );
    this.operations = operations;
    return operations;
  }

  selectOperation(operation: any) {
    this.operationSelect = operation;
  }

  goToOperations() {
    let uuid = uuidv4();
    this.cryptoService.operationsMap.set(uuid, this.getOperations());
    this.router.navigate([
      '/crypto/operations/' + this.cryptoCurrency + '/' + uuid,
    ]);
  }

  filterByPage(i: number) {
    if (!this.isFullList) {
      return i < 4;
    } else return true;
  }
}
