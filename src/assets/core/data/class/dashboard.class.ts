import { AppConfigConst } from '../constant/constant';
import {
  CategoryInterface,
  DashboardInterface,
  StatsInterface,
  WalletInterface,
} from '../interfaces/dashboard.interface';
import { Asset } from './crypto.class';
import { GenericModel } from './generic.class';
import { environment } from 'src/environments/environment';

export class Dashboard implements DashboardInterface {
  balance: number = 0;
  value: string = 'USD';
  performance: number = 0;
  performanceValue: number = 0;
  performanceSince: Date = new Date();
  performanceLastDate: Date = new Date();
  lastStatsPerformance: number = 0;
  lastStatsBalanceDifference: number = 0;
  yearsWalletStats: number[] = [];
  statsWalletDays: string[] = [];
  categories: Category[] = categories;
  wallets: Wallet[] = [];
  hasMoreRecords?: boolean;
}

export class Wallet extends GenericModel implements WalletInterface {
  name!: string;
  type!: string;
  imgName!: string;
  info?: Map<string, string>;
  infoString?: string;
  fileImage!: File;
  img: string = environment.baseUrlHeader + AppConfigConst.DEFAULT_WALLET_IMG;
  category!: string;
  allTimeHigh: number = 0;
  allTimeHighDate: Date = new Date();
  highPrice: number = 0;
  highPriceDate: Date = new Date();
  lowPrice: number = 0;
  lowPriceDate: Date = new Date();
  performanceLastStats: number = 0;
  differenceLastStats: number = 0;
  dateLastStats: Date = new Date();
  balance: number = 0;
  newBalance!: number; // Local Variable, used just for save
  assets: Asset[] = [];
  history: Stats[] = [];
}

export class Stats extends GenericModel implements StatsInterface {
  date!: Date;
  balance!: number;
  percentage!: number;
  trend!: number;
}

export class Category extends GenericModel implements CategoryInterface {
  name!: string;
  img!: string;
}

export const categories: Array<Category> = [
  {
    id: 1,
    name: 'Cash',
    img: 'cash-outline',
  },
  {
    id: 2,
    name: 'Credit Card',
    img: 'card-outline',
  },
  {
    id: 3,
    name: 'Debit Card',
    img: 'card-outline',
  },
  {
    id: 4,
    name: 'Recurrence',
    img: 'alarm-outline',
  },
  {
    id: 5,
    name: 'Bank Account',
    img: 'wallet-outline',
  },
  {
    id: 6,
    name: 'Save',
    img: 'lock-closed-outline',
  },
  {
    id: 7,
    name: 'Coupon',
    img: 'ticket-outline',
  },
  {
    id: 8,
    name: 'Check',
    img: 'id-card-outline',
  },
  {
    id: 9,
    name: 'Investments',
    img: 'bar-chart-outline',
  },
  {
    id: 10,
    name: 'Others',
    img: 'cube-outline',
  },
];
