import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../../data/class/generic.class';
import { GithubIssues, User } from '../../data/class/user.class';
import { StorageConstant } from '../../data/constant/constant';
import { SwalService } from '../../utils/swal.service';
import { Wallet } from '../../data/class/dashboard.class';
import { CacheService } from '../config/cache.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  environment = environment;
  isOnboardingCrypto: boolean = false;

  constructor(
    private http: HttpClient,
    public swalService: SwalService,
    private cache: CacheService
  ) {}

  backupData(): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (UserService.getUserData().mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      return this.http.get<ResponseModel>(environment.backupDataUrl, {
        headers: headers,
      });
    }
  }

  restoreData(wallets: Wallet[]): Observable<ResponseModel> {
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (UserService.getUserData().mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      return this.http.post<ResponseModel>(
        environment.restoreDataUrl,
        wallets,
        {
          headers: headers,
        }
      );
    }
  }

  cleanCache(): Observable<ResponseModel> {
    this.cache.clearCache();
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (UserService.getUserData().mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      return this.http.patch<ResponseModel>(environment.cleanCacheUrl, null, {
        headers: headers,
      });
    }
  }

  importMarketData(): Observable<ResponseModel> {
    this.cache.clearCache();
    const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authToken!,
    });
    if (UserService.getUserData().mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      return this.http.patch<ResponseModel>(environment.marketDataUrl, null, {
        headers: headers,
      });
    }
  }

  openIssues(githubIssues: GithubIssues): Observable<ResponseModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<ResponseModel>(
      environment.openGithubIssues,
      githubIssues,
      {
        headers: headers,
      }
    );
  }

  uploadImage(file: File): Observable<ResponseModel> {
    if (UserService.getUserData().mockedUser) {
      let response: ResponseModel = new ResponseModel();
      return of(response);
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({
        Authorization: authToken!,
        'Content-Type': 'multipart/form-data',
      });
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      return this.http.post<ResponseModel>(environment.uploadImage, formData);
    }
  }

  getTemplate(): Observable<any> {
    return this.http.get<any>(environment.getTemplate);
  }
}
