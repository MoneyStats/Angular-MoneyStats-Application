import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dashboard, Wallet } from '../data/class/dashboard.class';
import { ResponseModel } from '../data/class/generic.class';
import { User } from '../data/class/user.class';
import { StorageConstant } from '../data/constant/constant';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  environment = environment;
  public fullResume?: Map<string, Dashboard>;
  user?: User;
  constructor(private http: HttpClient, public cache: CacheService) {}

  getResumeData(): Observable<ResponseModel> {
    if (this.cache.getResumeCache()) return of(this.cache.getResumeCache());
    if (this.user?.mockedUser) {
      return this.http.get<ResponseModel>(environment.getResumeDataUrlMock);
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({ Authorization: authToken! });
      return this.http.get<ResponseModel>(environment.getResumeDataUrl, {
        headers: headers,
      });
    }
  }

  addStatsData(wallets: Wallet[]): Observable<ResponseModel> {
    this.cache.clearCache();
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({ Authorization: authToken! });
    if (this.user?.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      response.data = wallets;
      return of(response);
    } else {
      return this.http.post<ResponseModel>(
        environment.addStatsDataUrl,
        wallets,
        {
          headers: headers,
        }
      );
    }
  }
}
