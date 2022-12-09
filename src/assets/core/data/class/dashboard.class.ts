import {
  DashboardInterface,
  StatsInterface,
  WalletInterface,
} from '../interfaces/dashboard.interface';

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

export class Wallet implements WalletInterface {
  id!: number;
  name!: string;
  img!: string;
  category!: string;
  differenceLastStats!: number;
  dateLastStats!: Date;
  balance!: number;
  history: Array<Stats> = [];
}

export class Stats implements StatsInterface {
  date!: string;
  balance!: number;
  percentage!: number;
}
