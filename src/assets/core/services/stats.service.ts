import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinSymbol } from '../data/class/coin';
import { Dashboard, Wallet } from '../data/class/dashboard.class';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  environment = environment;
  public fullResume?: Map<string, Dashboard>;
  //public dashboard: Dashboard = new Dashboard();
  //public wallet?: Wallet;
  //public coinSymbol?: string;
  constructor(private http: HttpClient) {}

  getResume(): Observable<Map<string, Dashboard>> {
    return this.http.get<Map<string, Dashboard>>(environment.getResumeDataUrl);
  }
}
