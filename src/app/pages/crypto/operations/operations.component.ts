import { Component, OnInit } from '@angular/core';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { ActivatedRoute } from '@angular/router';
import { Operation } from 'src/assets/core/data/class/crypto.class';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
})
export class OperationsComponent implements OnInit {
  operations: Operation[] = [];
  cryptoCurrency: string = '';
  uniqueYears: any;
  operationsMapByYear: Map<string, any[]> = new Map<string, any[]>();
  operationSelect?: Operation;

  constructor(
    public cryptoService: CryptoService,
    private route: ActivatedRoute
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.route.params.subscribe((a: any) => {
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
    this.uniqueYears = [...new Set(years)];
    this.uniqueYears.forEach((year: string) => {
      this.operationsMapByYear?.set(
        year,
        operations.filter((o: any) => o.entryDate.toString().includes(year))
      );
    });
  }

  selectOperation(operation: any) {
    this.operationSelect = operation;
  }
}
