import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinSymbol } from '../data/class/coin';
import { Dashboard, Wallet } from '../data/class/dashboard.class';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  environment = environment;
  public walletActive?: Wallet[];
  public walletDeleted?: Wallet[];
  public coinSymbol?: string;
  constructor(private http: HttpClient) {}

  getWallet(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(environment.getWalletDataUrl);
  }
}
