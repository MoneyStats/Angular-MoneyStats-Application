import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Stats, Wallet } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { ErrorService } from 'src/assets/core/interceptors/error.service';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { StatsService } from 'src/assets/core/services/stats.service';

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
  @Input('statsAssetsDays') statsAssetsDays: string[] = [];
  @Output('emitAddStats') emitAddStats = new EventEmitter<Wallet[]>();

  // Boolean per bottoni e titoli Add Stats
  isAddStatsSelected: boolean = false;
  isResumeAddAssets: boolean = false;

  saveValidation: boolean = false;
  // Used for warning date
  //dateValidation: boolean = false;
  dateStats: string = '';

  currentIndex: number = 0;

  // Datas for Operations
  isOperationSelected: boolean = false;

  constructor() {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  /**
   * ADD STATS METHODS
   */
  addStatsClick() {
    this.isAddStatsSelected = true;
    // Ho bisogno di fare un check della history perchè se non c'è una history devo crearne una vuota
    let stats = new Stats();
    stats.balance = 0;
    stats.date = new Date();
    stats.percentage = 0;
    stats.trend = 0;
    this.assets.forEach((asset) => {
      if (asset.history == undefined || asset.history.length == 0) {
        asset.history = [stats];
      }
    });
  }

  addOperationClick() {
    this.isOperationSelected = true;
  }
  /**
   * END ADD STATS METHODS
   */

  addStats(wallets: Wallet[]) {
    this.resetForm();
    this.emitAddStats.emit(wallets);
  }

  resetForm() {
    this.isAddStatsSelected = false;
    this.isResumeAddAssets = false;
    this.saveValidation = false;
    //this.dateValidation = false;
    this.dateStats = '';
    this.currentIndex = 0;
  }
}
