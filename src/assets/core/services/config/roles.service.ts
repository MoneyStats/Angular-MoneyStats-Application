import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from '../api/user.service';
import { UserRole } from '../../data/constant/constant';

@Injectable({
  providedIn: 'root',
})
export class Roles {
  environment = environment;

  public static hasTaxCalculatorRoles() {
    const user = UserService.getUserData();
    return (
      user.roles.includes(UserRole.TAX_CALCULATOR_ADMIN) ||
      user.roles.includes(UserRole.TAX_CALCULATOR_USER)
    );
  }

  public static hasAdminRoles() {
    const user = UserService.getUserData();
    return user.roles.includes(UserRole.ADMIN);
  }
}
