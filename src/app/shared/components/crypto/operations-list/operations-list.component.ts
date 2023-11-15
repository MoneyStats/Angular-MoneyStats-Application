import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  ModalConstant,
  OperationsType,
} from 'src/assets/core/data/constant/constant';
import {
  CryptoDashboard,
  Operation,
} from 'src/assets/core/data/class/crypto.class';
import { v4 as uuidv4 } from 'uuid';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operations-list',
  templateUrl: './operations-list.component.html',
  styleUrls: ['./operations-list.component.scss'],
})
export class OperationsListComponent implements OnInit, OnChanges {
  @Input('walletsAsset') walletsAsset: Wallet[] = [];
  @Input('cryptoDashboard') cryptoDashboard: CryptoDashboard =
    new CryptoDashboard();
  @Input('isAssetOperations') isAssetOperations: boolean = false;

  // Input full list
  @Input('operationsMapByYear') operationsMapByYear: Map<string, any[]> =
    new Map<string, any[]>();
  @Input('year') year: string = '';

  @Input('isFullList') isFullList: boolean = false;
  @Input('modalID') modalID: string = uuidv4();

  operationSelect: any;

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
    let operations: Operation[] = [];
    let wallets = deepCopy(this.walletsAsset);
    wallets.forEach((wallet) => {
      if (wallet.assets && wallet.assets.length > 0)
        wallet.assets.forEach((asset) => {
          if (asset.operations && asset.operations.length > 0)
            asset.operations.forEach((operation) => {
              operation.asset = asset;
              operation.wallet = wallet;
              if (operation.type != OperationsType.NEWINVESTMENT)
                operation.assetSell = deepCopy(
                  this.cryptoService.cryptoDashboard.assets.find(
                    (a) => a.symbol == operation.entryCoin
                  )
                );
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
      '/crypto/operations/' + this.cryptoDashboard.currency + '/' + uuid,
    ]);
  }

  filterByPage(i: number) {
    if (!this.isFullList) {
      return i < 4;
    } else return true;
  }
}
