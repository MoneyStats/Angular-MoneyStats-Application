export interface DashboardInterface {
  balance: number;
  value: string;
  performace: number;
  performanceSince: Date;
  performanceLastDate: Date;
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
  allTimeHigh: number;
  allTimeHighDate: Date;
  totalPerformance: number;
  highPrice: number;
  highPriceDate: Date;
  lowPrice: number;
  lowPriceDate: Date;
  differenceLastStats: number;
  dateLastStats: Date;
  balance: number;
  history: StatsInterface[];
}

export interface StatsInterface {
  date: string;
  balance: number;
  percentage: number;
}
