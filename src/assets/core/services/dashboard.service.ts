import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinSymbol } from '../data/class/coin';
import { Dashboard, Wallet } from '../data/class/dashboard.class';
import { ResponseModel } from '../data/class/generic.class';
import { User } from '../data/class/user.class';
import { StorageConstant } from '../data/constant/modal.constant';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  environment = environment;
  public dashboard: Dashboard = new Dashboard();
  public wallet?: Wallet;
  public coinSymbol?: string;
  user?: User;
  constructor(private http: HttpClient) {}

  getData(): Observable<ResponseModel> {
    if (this.user?.mockedUser) {
      return this.http.get<ResponseModel>(environment.getDashboardDataUrlMock);
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({ authToken: authToken! });
      return this.http.get<ResponseModel>(environment.getDashboardDataUrl, {
        headers: headers,
      });
    }
  }
}
