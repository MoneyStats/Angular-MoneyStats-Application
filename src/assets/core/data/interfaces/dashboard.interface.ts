export interface DashboardInterface {
  balance: number;
  value: string;
  performace: number;
  performanceSince: Date;
  lastStatsPerformance: number;
  lastStatsBalanceDifference: number;
  statsWalletDays: string[];
  wallets: WalletInterface[];
}

export interface WalletInterface {
  id: number;
  name: string;
  img: string;
  category: string;
  differenceLastStats: number;
  history: Array<StatsInterface>;
}

export interface StatsInterface {
  date: string;
  balance: number;
}
