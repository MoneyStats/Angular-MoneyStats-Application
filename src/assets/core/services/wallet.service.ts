import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinSymbol } from '../data/class/coin';
import { Dashboard, Stats, Wallet } from '../data/class/dashboard.class';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  environment = environment;
  totalBalance?: number;
  public walletActive?: Wallet[];
  public walletDeleted?: Wallet[];
  public coinSymbol?: string;

  //Used for WalletDetails
  public walletDetails?: Wallet[];
  public statsList?: Stats[];
  constructor(private http: HttpClient) {}

  getWallet(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(environment.getWalletDataUrl);
  }
}
