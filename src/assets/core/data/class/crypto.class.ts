import { Stats, Wallet } from './dashboard.class';
import { GenericModel } from './generic.class';

export class CryptoDashboard {
  balance: number = 0;
  currency: string = 'USD';
  btcBalance: number = 0;
  lastUpdate: Date = new Date();
  statsAssetsDays: string[] = [];
  holdingLong: TradingStatus = new TradingStatus();
  trading: TradingStatus = new TradingStatus();
  performance: TradingStatus = new TradingStatus();
  assets: Asset[] = []; // Usata solo per i grafici
  wallets: Wallet[] = [];
}

export class TradingStatus {
  balance: number = 0;
  performance: number = 0;
  trend: number = 0;
  lastUpdate: Date = new Date();
}

export class Asset extends GenericModel {
  identifier?: string;
  name?: string;
  symbol?: string;
  rank?: number;
  value?: number;
  current_price?: number;
  icon?: string;
  balance?: number;
  invested?: number;
  lastUpdate: Date = new Date();
  performance?: number;
  trend?: number;
  history?: Stats[] = [];
  operations: Array<any> = [];
}
