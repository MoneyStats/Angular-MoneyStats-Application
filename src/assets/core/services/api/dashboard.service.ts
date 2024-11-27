import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dashboard } from '../../data/class/dashboard.class';
import { ResponseModel } from '../../data/class/generic.class';
import { StorageConstant } from '../../data/constant/constant';
import { CacheService } from '../config/cache/cache.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  environment = environment;
  public isOnboarding = false;
  constructor(private http: HttpClient, public cache: CacheService) {}

  getDashboardData(): Observable<ResponseModel> {
    if (this.cache.getDashboardCache())
      return of(this.cache.getDashboardCache());
    if (UserService.getUserData().mockedUser) {
      return this.http.get<ResponseModel>(environment.getDashboardDataUrlMock);
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({ Authorization: authToken! });
      return this.http.get<ResponseModel>(environment.getDashboardDataUrl, {
        headers: headers,
      });
    }
  }

  contactUs(
    name: string,
    email: string,
    message: string
  ): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const support = {
      name: name,
      email: email,
      message: message,
    };
    return this.http.post<ResponseModel>(environment.contactSupport, support);
  }
}
