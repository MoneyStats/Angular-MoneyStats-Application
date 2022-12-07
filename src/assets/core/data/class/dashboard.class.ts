import { DashboardInterface } from '../interfaces/dashboard.interface';

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

export class Wallet {
  id!: number;
  name!: string;
  img!: string;
  category!: string;
  differenceLastStats!: number;
  dateLastStats!: Date;
  balance!: number;
  history: Array<Stats> = [];
}

export class Stats {
  date!: string;
  balance!: number;
}
