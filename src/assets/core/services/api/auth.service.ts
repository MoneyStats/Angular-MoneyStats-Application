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
    localStorage.removeItem(StorageConstant.ACCESSTOKEN);
    this.router.navigate(['auth/login']);
  }

  register(user: User, invitationCode: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      environment.registerDataUrl + '?invitationCode=' + invitationCode,
      user
    );
  }

  login_old(username: string, password: string): Observable<ResponseModel> {
    this.cache.clearCache();
    const url = environment.loginDataUrl + '?username=' + username;
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

  login(username: string, password: string): Observable<ResponseModel> {
    this.cache.clearCache();
    const url = environment.tokenDataUrl + '?client_id='+environment.clientID+'&grant_type=password&include_user_data=true';
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
        Authorization: authToken!,
      });
      const url = environment.authorizeUrl + '?client_id='+environment.clientID+'&access_type=online&redirect_uri=http%3A%2F%2Flocalhost%3A5501%2Findex.html&scope=openid&response_type=code';
      return this.http.get<ResponseModel>(url, {
        headers: headers,
      });
    }
  }

  forgotPassword(email: string): Observable<ResponseModel> {
    const url = environment.forgotPasswordUrl + '?email=' + email;
    return this.http.post<ResponseModel>(url, {});
  }

  resetPassword(password: string, token: string): Observable<ResponseModel> {
    password = btoa(password);
    const url =
      environment.resetPasswordUrl +
      '?password=' +
      password +
      '&token=' +
      token;
    return this.http.post<ResponseModel>(url, {});
  }

  checkLogin(authToken: string): Observable<ResponseModel> {
    if (this.user?.mockedUser) {
      return this.http.get<ResponseModel>(environment.getUserUrl);
    } else {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authToken!,
      });
      return this.http.get<ResponseModel>(environment.userInfoDataUrl, {
        headers: headers,
      });
    }
  }

  refreshToken(authToken: string): Observable<ResponseModel> {
    if (this.user?.mockedUser) {
      return this.http.get<ResponseModel>(environment.getUserUrl);
    } else {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const token = {
        accessToken: authToken,
      };
      return this.http.post<ResponseModel>(environment.refreshTokenUrl, token, {
        headers: headers,
      });
    }
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
      return this.http.post<ResponseModel>(
        environment.updateUserDataUrl,
        user,
        {
          headers: headers,
        }
      );
    }
  }

  public static getUserFromStorage(): User {
    const storage = localStorage.getItem(StorageConstant.USERACCOUNT);
    let user: User = new User();
    if (storage) return JSON.parse(storage);
    return user;
  }
}
