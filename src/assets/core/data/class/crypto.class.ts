export class CryptoDashboard {
  balance: number = 0;
  currency: string = 'USD';
  btcBalance: number = 0;
  lastUpdate: Date = new Date();
  holdingLong: TradingStatus = new TradingStatus();
  holdingMid: TradingStatus = new TradingStatus();
  trading: TradingStatus = new TradingStatus();
  assets: Asset[] = [];
}

export class TradingStatus {
  balance: number = 0;
  performance: number = 0;
  lastUpdate: Date = new Date();
}

export class Asset {
  name?: string;
  shortName?: string;
  value?: number;
  icon?: string;
  balance?: number;
  performance?: number;
}
