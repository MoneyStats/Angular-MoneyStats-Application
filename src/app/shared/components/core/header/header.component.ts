import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/assets/core/services/api/user.service';
import { SharedService } from 'src/assets/core/services/config/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input('user') user?: User;
  @Input('dashboard') dashboard?: Dashboard;
  environment = environment;

  isShadowActive: boolean = false;
  constructor(
    private shared: SharedService,
    public userService: AuthService,
    private router: Router
  ) {
    router.events.subscribe((event: any) => {
      // Controlla se l'evento è di tipo NavigationEnd e contiene la proprietà url
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.isShadowActive = true;
        } else {
          this.isShadowActive = false;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateData();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    if (this.user?.name === 'DEFAULT_NAME') {
      this.user = this.userService.user;
    }
    if (this.user?.name === 'DEFAULT_NAME') {
      this.user = UserService.getUserData();
    }
  }

  updateData(): void {
    if (!this.dashboard) this.dashboard = this.shared.getDashboard();
    this.user = UserService.getUserData();
  }

  availableSoon() {
    ToastService.availableSoon();
  }

  logout() {
    this.userService.logout();
  }
}
