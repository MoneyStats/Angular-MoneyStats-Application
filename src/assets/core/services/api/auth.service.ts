import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../../data/class/generic.class';
import { MockUser, User } from '../../data/class/user.class';
import { StorageConstant } from '../../data/constant/constant';
import { SwalService } from '../../utils/swal.service';
import { CacheService } from '../config/cache/cache.service';
import { deprecate } from 'util';
import { Utils } from '../config/utils.service';
import { LOG } from '../../utils/log.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  environment = environment;
  public user: User = new User();

  constructor(
    private http: HttpClient,
    public swalService: SwalService,
    private router: Router,
    private cache: CacheService
  ) {}

  logout() {
    this.cache.clearCache();
    if (!this.user?.mockedUser) {
      const token = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:
          token && token.includes('Bearer') ? token : 'Bearer ' + token,
      });
      const url = environment.logoutUrl + '?client_id=' + environment.clientID;
      this.http
        .post<ResponseModel>(
          url,
          {},
          {
            headers: headers,
          }
        )
        .subscribe((data) => {
          LOG.info(data.message!, 'AuthService');
        });
    }
    localStorage.removeItem(StorageConstant.ACCESSTOKEN);
    localStorage.removeItem(StorageConstant.USERACCOUNT);
    this.router.navigate(['auth/login']);
  }

  register(user: User, invitationCode: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      environment.registerDataUrl + '?invitationCode=' + invitationCode,
      user
    );
  }

  login(username: string, password: string): Observable<ResponseModel> {
    this.cache.clearCache();
    const url =
      environment.tokenDataUrl +
      '?client_id=' +
      environment.clientID +
      '&grant_type=password&include_user_data=true&redirect_uri=' +
      environment.redirectUri;
    if (username === MockUser.USERNAME && password === MockUser.PASSWORD) {
      return this.http.get<ResponseModel>(environment.getUserUrl);
    } else {
      //password = btoa(password);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(username + ':' + password),
      });
      return this.http.post<ResponseModel>(url, {}, { headers: headers });
    }
  }

  authorize(authToken: string): Observable<ResponseModel> {
    if (this.user?.mockedUser) {
      return this.http.get<ResponseModel>(environment.authorizeUrlMock);
    } else {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authToken!.includes('Bearer')
          ? authToken
          : 'Bearer ' + authToken,
      });
      const url =
        environment.authorizeUrl +
        '?client_id=' +
        environment.clientID +
        '&access_type=online&redirect_uri=http%3A%2F%2Flocalhost%3A5501%2Findex.html&scope=openid&response_type=code';
      return this.http.get<ResponseModel>(url, {
        headers: headers,
      });
    }
  }

  refreshToken(): Observable<ResponseModel> {
    if (this.user?.mockedUser) {
      return this.http.get<ResponseModel>(environment.getUserUrl);
    } else {
      const token: any = localStorage.getItem(StorageConstant.AUTHTOKEN);
      const access_token = token.access_token;
      const refresh_token = token.refresh_token;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: access_token!.includes('Bearer')
          ? access_token
          : 'Bearer ' + access_token,
      });
      const url =
        environment.tokenDataUrl +
        '?client_id=' +
        environment.clientID +
        '&grant_type=refresh_token&include_user_data=true&refresh_token=' +
        refresh_token;
      return this.http.get<ResponseModel>(url, {
        headers: headers,
      });
    }
  }

  forgotPassword(email: string): Observable<ResponseModel> {
    const url = environment.forgotPasswordUrl + '?emailSend=true';
    const body = {
      templateId: 'MONEYSTATS_RESET_PASSWORD',
      email: email,
      params: {
        'PARAM.FRONT_END_URL': location.origin,
      },
    };
    return this.http.post<ResponseModel>(url, body);
  }

  resetPassword(password: string, token: string): Observable<ResponseModel> {
    password = btoa(password);
    const url = environment.resetPasswordUrl;

    const body = {
      token: token,
      password: password,
    };
    return this.http.post<ResponseModel>(url, body);
  }

  updateUserData(user: User): Observable<ResponseModel> {
    this.cache.clearCache();
    if (this.user?.mockedUser) {
      let response: ResponseModel = new ResponseModel();
      response.data = user;
      return of(response);
    } else {
      if (user.password) user.password = btoa(user.password);
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authToken!,
      });
      return this.http.put<ResponseModel>(environment.updateUserDataUrl, user, {
        headers: headers,
      });
    }
  }

  public static getUserFromStorage(): User {
    const storage = localStorage.getItem(StorageConstant.USERACCOUNT);
    let user: User = new User();
    if (storage) return JSON.parse(storage);
    return user;
  }
}
