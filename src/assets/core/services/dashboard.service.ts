import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dashboard } from '../data/class/dashboard.class';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  environment = environment;
  public dashboard: Dashboard = new Dashboard();
  constructor(private http: HttpClient) {}

  getData(): Observable<Dashboard> {
    return this.http.get<Dashboard>(environment.getDashboardDataUrl);
  }
}
