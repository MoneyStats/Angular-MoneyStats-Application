import { DashboardInterface } from '../interfaces/dashboard.interface';

export class Dashboard implements DashboardInterface {
  balance: number = 0;
  value: string = 'USD';
  performace: number = 0;
  performanceSince: Date = new Date();
  lastStatsPerformance: number = 0;
  lastStatsBalanceDifference: number = 0;
  wallets: Wallet[] = [];
}

export class Wallet {
  id!: number;
  name!: string;
  img!: string;
  category!: string;
  differenceLastStats!: number;
}
