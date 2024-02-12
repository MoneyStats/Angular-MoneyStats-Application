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
  //performance: TradingStatus = new TradingStatus();
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
  category?: string;
  newValue?: number;
  current_price?: number;
  icon?: string;
  balance: number = 0;
  invested: number = 0;
  lastUpdate: Date = new Date();
  // Performance and trend sono dell'ultimo Stats
  performance: number = 0;
  trend: number = 0;
  history?: Stats[] = [];
  operations: Array<any> = [];
}

export class Operation extends GenericModel {
  identifier?: string;
  type?: string; // Holding, Trading, New Investment
  status?: string; // Open Closed
  entryDate?: Date;
  entryCoin?: string;
  entryPrice?: number; // Prezzo d'acquisto
  entryPriceValue?: number; // Conversione in FIAT di quanto si sta investendo
  entryQuantity?: number; // Quantità di value investita
  exitDate?: Date; // Data di uscita
  exitCoin?: string;
  exitPrice?: number;
  exitPriceValue?: number; // Conversione in FIAT di quanto si è guadagnato o perso
  exitQuantity?: number; // Quantità di value investita
  performance?: number;
  trend?: number;
  fees?: number;
  asset?: Asset;
  wallet?: Wallet;
  walletSell?: Wallet;
  assetSell?: Asset;
  trendSum?: number; //Usato per tabella
  balance?: number; //Usato per tabella
}
