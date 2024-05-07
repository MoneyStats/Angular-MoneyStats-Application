import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/api/dashboard.service';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input('user') user?: User;
  @Input() dashboard?: Dashboard;
  environment = environment;

  isShadowActive: boolean = false;
  constructor(
    private dashboardService: DashboardService,
    public userService: AuthService,
    private router: Router
  ) {
    router.events.subscribe((data: any) => {
      if (data.url == '/') {
        this.isShadowActive = true;
      } else this.isShadowActive = false;
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
      this.user = JSON.parse(
        localStorage.getItem(StorageConstant.USERACCOUNT)!
      );
    }
  }

  updateData(): void {
    this.dashboard = this.dashboardService.dashboard;
    this.user = this.userService.user;
  }

  availableSoon() {
    ToastService.availableSoon();
  }

  logout() {
    this.userService.logout();
  }
}
