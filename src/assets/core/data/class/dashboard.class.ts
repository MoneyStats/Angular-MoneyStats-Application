import { DashboardInterface } from '../interfaces/dashboard.interface';

export class Dashboard implements DashboardInterface {
  balance: number = 0;
  performace: number = 0;
  performanceSince: Date = new Date();
  lastStatsPerformance: number = 0;
  lastStatsBalanceDifference: number = 0;
}
