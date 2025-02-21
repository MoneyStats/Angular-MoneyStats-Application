import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Stats, Wallet } from '../../data/class/dashboard.class';
import { ResponseModel } from '../../data/class/generic.class';
import { StorageConstant } from '../../data/constant/constant';
import { CacheService } from '../config/cache/cache.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  environment = environment;

  constructor(private http: HttpClient, public cache: CacheService) {}

  /**
   * Get the full List of Wallets
   * @returns List of Wallets
   */
  getWalletsData(): Observable<ResponseModel> {
    if (this.cache.getWalletsCache()) return of(this.cache.getWalletsCache());
    if (UserService.getUserData().mockedUser) {
      return this.http.get<ResponseModel>(environment.mockedGetWalletsDataUrl);
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({ Authorization: authToken! });
      const url = environment.getWalletsDataUrl;
      return this.http.get<ResponseModel>(url, {
        headers: headers,
      });
    }
  }

  /**
   * Get the single Wallet Data
   * @param id Valid id Wallet
   * @returns Single Wallet Data
   */
  getWalletByID(id: number): Observable<ResponseModel> {
    if (this.cache.getWalletByIdCache(id))
      return of(this.cache.getWalletByIdCache(id));
    if (UserService.getUserData().mockedUser) {
      return this.http.get<ResponseModel>(
        environment.mockedGetWalletByIdDataUrl.replace('#ID#', id.toString())
      );
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({ Authorization: authToken! });
      const url = environment.getWalletByIdUrl.replace(':id', id.toString());
      return this.http.get<ResponseModel>(url, {
        headers: headers,
      });
    }
  }

  /**
   * Save or update a Wallet
   * @param wallet Wallet to be edited
   * @returns Wallet edited or saved
   */
  addOrUpdateWalletsData(wallet: Wallet): Observable<ResponseModel> {
    this.cache.clearCache();
    if (UserService.getUserData().mockedUser) {
      let response: ResponseModel = new ResponseModel();
      response.data = wallet;
      return of(response);
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({
        Authorization: authToken!,
      });
      if (wallet.id)
        return this.http.put<ResponseModel>(
          environment.postWalletsDataUrl,
          wallet,
          { headers: headers }
        );
      return this.http.post<ResponseModel>(
        environment.postWalletsDataUrl,
        wallet,
        { headers: headers }
      );
    }
  }

  /**
   * Remove Wallet
   * @param id Id of the wallet to be cancel
   * @returns Wallet Cancelled
   */
  deleteWalletsData(id: number): Observable<ResponseModel> {
    this.cache.clearCache();
    if (UserService.getUserData().mockedUser) {
      return this.http.get<ResponseModel>(
        environment.mockedGetWalletByIdDataUrl
      );
    } else {
      const authToken = localStorage.getItem(StorageConstant.ACCESSTOKEN);
      const headers = new HttpHeaders({
        Authorization: authToken!,
      });
      const url = environment.deleteWalletsDataUrl.replace(
        ':id',
        id.toString()
      );
      return this.http.delete<ResponseModel>(url, {
        headers: headers,
      });
    }
  }
}
