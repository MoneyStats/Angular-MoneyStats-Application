import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../../data/class/generic.class';
import { MockUser, User } from '../../data/class/user.class';
import { StorageConstant } from '../../data/constant/constant';
import { SwalService } from '../../utils/swal.service';
import { CacheService } from '../config/cache/cache.service';
import { Utils } from '../config/utils.service';
import { LOG } from '../../utils/log.service';
import { WebService } from '../config/web.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  environment = environment;
  public user: User = new User();
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<ResponseModel | null> =
    new BehaviorSubject<ResponseModel | null>(null);

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
    WebService.logoutStorage();
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

  token(code: string): Observable<ResponseModel> {
    this.cache.clearCache();
    const url =
      environment.tokenDataUrl +
      '?client_id=' +
      environment.clientID +
      //'&scope=openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email' +
      '&scope=openid profile email' +
      '&grant_type=authorization_code&include_user_data=true&redirect_uri=' +
      environment.redirectUri +
      '/auth/login' +
      '&code=' +
      code;
    //password = btoa(password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {};
    return this.http.post<ResponseModel>(url, body, {
      headers: headers,
    });
  }

  authorize(): Observable<HttpResponse<any>> {
    const url =
      environment.authorizeUrl +
      '?client_id=' +
      environment.clientID +
      '&access_type=online&redirect_uri=' +
      encodeURIComponent(environment.redirectUri + '/auth/login') +
      //'&scope=openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email' +
      '&scope=openid profile email' +
      '&type=google' +
      '&response_type=code';
    return this.http.get<any>(url, {
      observe: 'response', // 🔥 Include gli header nella risposta
    });
  }

  authorizeCheck(authToken: string): Observable<ResponseModel> {
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
        '&access_type=online&redirect_uri=' +
        environment.redirectUri +
        '&scope=openid&response_type=code';
      return this.http.get<ResponseModel>(url, {
        headers: headers,
      });
    }
  }

  refreshToken(): Observable<ResponseModel> {
    if (this.user?.mockedUser) {
      return this.http.get<ResponseModel>(environment.getUserUrl);
    } else {
      if (this.isRefreshing) {
        return this.refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token) => {
            return of(token); // Restituisce il token aggiornato senza rifare la richiesta
          })
        );
      }
      this.isRefreshing = true;

      const tokenString: any = localStorage.getItem(StorageConstant.AUTHTOKEN);
      const token: any = tokenString ? JSON.parse(tokenString) : null;
      if (!Utils.isNullOrEmpty(token)) {
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
        const body = {};
        return this.http
          .post<ResponseModel>(url, body, {
            headers: headers,
          })
          .pipe(
            tap((resp) => {
              this.refreshTokenSubject.next(resp.data.access_token);
              this.isRefreshing = false;
            }),
            catchError((error) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(null);
              return throwError(() => error);
            })
          );
      } else throw Error('Access Token not valid');
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

      const userInfoCacheUrl = environment.cleanCacheUrl + '?isUserInfo=true';
      // Esegue la PATCH, poi la PUT in sequenza
      return this.http
        .patch<ResponseModel>(userInfoCacheUrl, null, { headers })
        .pipe(
          concatMap(() =>
            this.http.put<ResponseModel>(environment.updateUserDataUrl, user, {
              headers,
            })
          )
        );
      //return this.http.put<ResponseModel>(environment.updateUserDataUrl, user, {
      //  headers: headers,
      //});
    }
  }

  public static getUserFromStorage(): User {
    const storage = localStorage.getItem(StorageConstant.USERACCOUNT);
    let user: User = new User();
    if (storage) return JSON.parse(storage);
    return user;
  }
}
