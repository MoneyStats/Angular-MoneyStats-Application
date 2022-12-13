import {
  DashboardInterface,
  StatsInterface,
  WalletInterface,
} from '../interfaces/dashboard.interface';
import { GenericModel } from './generic.class';

export class Dashboard implements DashboardInterface {
  balance: number = 0;
  value: string = 'USD';
  performace: number = 0;
  performanceSince: Date = new Date();
  performanceLastDate: Date = new Date();
  lastStatsPerformance: number = 0;
  lastStatsBalanceDifference: number = 0;
  statsWalletDays: string[] = [];
  wallets: Wallet[] = [];
}

export class Wallet extends GenericModel implements WalletInterface {
  id!: number;
  name!: string;
  img!: string;
  category!: string;
  allTimeHigh!: number;
  allTimeHighDate!: Date;
  totalPerformance!: number;
  highPrice!: number;
  highPriceDate!: Date;
  lowPrice!: number;
  lowPriceDate!: Date;
  differenceLastStats!: number;
  dateLastStats!: Date;
  balance!: number;
  history: Stats[] = [];
}

export class Stats implements StatsInterface {
  id!: number;
  date!: string;
  balance!: number;
  percentage!: number;
}
