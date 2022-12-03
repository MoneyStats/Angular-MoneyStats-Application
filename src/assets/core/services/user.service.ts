import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../data/class/user.class';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  environment = environment;
  public user: User = new User();
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(environment.getUserUrl);
  }
}
