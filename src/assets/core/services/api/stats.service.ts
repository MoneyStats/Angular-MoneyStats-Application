import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dashboard, Wallet } from '../../data/class/dashboard.class';
import { ResponseModel } from '../../data/class/generic.class';
import { StorageConstant } from '../../data/constant/constant';
import { CacheService } from '../config/cache.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  environment = environment;
  public fullResume?: Map<string, Dashboard>;

  constructor(private http: HttpClient, public cache: CacheService) {}

  getResumeData(year: number): Observable<ResponseModel> {
    if (this.cache.getResumeCache(year))
      return of(this.cache.getResumeCache(year));
    if (UserService.getUserData().mockedUser) {
      return this.http.get<ResponseModel>(environment.getResumeDataUrlMock);
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({ Authorization: authToken! });
      const url = environment.getResumeDataUrl.replace(
        ':year',
        year.toString()
      );
      return this.http.get<ResponseModel>(url, {
        headers: headers,
      });
    }
  }

  getHistoryData(): Observable<ResponseModel> {
    if (this.cache.getHistoryCache()) return of(this.cache.getHistoryCache());
    if (UserService.getUserData().mockedUser) {
      return this.http.get<ResponseModel>(environment.getHistoryDataUrlMock);
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({ Authorization: authToken! });
      const url = environment.getHistoryDataUrl;
      return this.http.get<ResponseModel>(url, {
        headers: headers,
      });
    }
  }

  addStatsData(wallets: Wallet[]): Observable<ResponseModel> {
    this.cache.clearCache();
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({ Authorization: authToken! });
    if (UserService.getUserData().mockedUser) {
      let response: ResponseModel = new ResponseModel();
      response.data = wallets;
      return of(response);
    } else {
      return this.http.post<ResponseModel>(
        environment.postStatsDataUrl,
        wallets,
        {
          headers: headers,
        }
      );
    }
  }
}
