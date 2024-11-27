import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/api/crypto.service';
import { ActivatedRoute } from '@angular/router';
import { Operation } from 'src/assets/core/data/class/crypto.class';
import { Subject, Subscription } from 'rxjs';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { SharedService } from 'src/assets/core/services/config/shared.service';
import { Utils } from 'src/assets/core/services/config/utils.service';

@Component({
    selector: 'app-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss'],
    standalone: false
})
export class OperationsComponent implements OnInit, OnDestroy {
  routeSubscribe: Subscription = new Subscription();

  operations: Operation[] = [];
  cryptoCurrency: string = '';
  uniqueYears: any;
  operationsMapByYear: Map<string, Operation[]> = new Map<
    string,
    Operation[]
  >();
  operationSelect?: Operation;

  @Output('cryptoWallets') cryptoWallets: Array<Wallet> = [];

  constructor(
    public cryptoService: CryptoService,
    private shared: SharedService,
    private route: ActivatedRoute
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.routeSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.cryptoWallets = this.shared.getCryptoWallets();
    this.routeSubscribe = this.route.params.subscribe((a: any) => {
      this.cryptoCurrency = a.currency;
      let operations = this.cryptoService.operationsMap.get(a.uuid)!;
      this.mapOperationsByYear(operations);
    });
  }

  mapOperationsByYear(operations: any) {
    let years: Array<string> = [];
    operations.forEach((operation: any) => {
      years.push(operation.entryDate.toString().split('-')[0]);
    });
    let op = Utils.copyObject(operations);
    this.uniqueYears = [...new Set(years)];
    this.uniqueYears.forEach((year: string) => {
      this.operationsMapByYear?.set(
        year,
        op.filter((o: any) => o.entryDate.toString().includes(year))
      );
    });
  }

  selectOperation(operation: any) {
    this.operationSelect = operation;
  }
}
