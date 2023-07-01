import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { Stats } from 'src/assets/core/data/class/dashboard.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';

@Component({
  selector: 'app-investments-history',
  templateUrl: './investments-history.component.html',
  styleUrls: ['./investments-history.component.scss'],
})
export class InvestmentsHistoryComponent implements OnInit, OnChanges {
  @Input('cryptoResume') cryptoResume!: Map<string, CryptoDashboard>;
  @Input('cryptoCurrency') cryptoCurrency: string = '';
  @Input('assets') assets: Asset[] = [];
  // History Tab
  totalList: Array<any> = [];
  totalMap: Map<string, any> = new Map<string, any>();
  balances: Array<number> = [];
  tableBalance: Array<any> = [];
  // END History Tab

  constructor(private cryptoService: CryptoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getResume();
  }

  ngOnInit(): void {
    //this.getResume();
  }

  getResume() {
    if (!this.cryptoResume) {
      this.cryptoResume = deepCopy(this.cryptoService.cryptoResume);
    }
    this.cryptoResume.forEach((value: CryptoDashboard, key: string) => {
      this.tableBalance.push(this.tableCreate(key, value));
    });
    this.totalMap.set('History', this.totalList);
  }

  /**
   * History Tab Section
   */
  tableCreate(date: string, dashboard: any) {
    let array: any = [];

    let total: any = new Stats();
    total.balance = dashboard.balance;
    total.date = date;

    let percentage = (
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
      100
    ).toFixed(2);
    let trend = parseFloat(
      (total.balance - this.balances[this.balances.length - 1]).toFixed(2)
    );

    if (Number.isNaN(total.balance) || total.balance == undefined) {
      total.balance = 0;
    }
    total.percentage = parseFloat(percentage);
    if (Number.isNaN(total.percentage)) {
      total.percentage = 0;
    }
    total.trend = trend;
    if (Number.isNaN(total.trend)) {
      total.trend = 0;
    }
    array.push(total);
    this.totalList.push(total);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
  /**
   * END History Tab Section
   */
}
