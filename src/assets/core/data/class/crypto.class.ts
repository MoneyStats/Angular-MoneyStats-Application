import { Wallet } from './dashboard.class';

export class CryptoDashboard {
  balance: number = 0;
  currency: string = 'USD';
  btcBalance: number = 0;
  lastUpdate: Date = new Date();
  holdingLong: TradingStatus = new TradingStatus();
  trading: TradingStatus = new TradingStatus();
  performance: TradingStatus = new TradingStatus();
  wallets: Wallet[] = [];
}

export class TradingStatus {
  balance: number = 0;
  performance: number = 0;
  lastUpdate: Date = new Date();
}

export class Asset {
  id?: number;
  identifier?: string;
  name?: string;
  symbol?: string;
  value?: number;
  icon?: string;
  balance?: number;
  performance?: number;
  operations: Array<any> = [];
}
