export interface DashboardInterface {
  balance: number;
  value: string;
  performance: number;
  performanceValue: number;
  performanceSince: Date;
  performanceLastDate: Date;
  lastStatsPerformance: number;
  lastStatsBalanceDifference: number;
  statsWalletDays: string[];
  wallets: WalletInterface[];
}

export interface WalletInterface {
  name: string;
  img: string;
  category: string;
  allTimeHigh: number;
  allTimeHighDate: Date;
  highPrice: number;
  highPriceDate: Date;
  lowPrice: number;
  lowPriceDate: Date;
  differenceLastStats: number;
  performanceLastStats: number;
  dateLastStats: Date;
  balance: number;
  history: StatsInterface[];
}

export interface StatsInterface {
  date: string;
  balance: number;
  percentage: number;
  trend: number;
}

export interface CategoryInterface {
  name: string;
  img: string;
}
