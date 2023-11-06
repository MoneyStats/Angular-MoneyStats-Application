import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
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
  constructor(
    private toast: ToastService,
    private dashboardService: DashboardService,
    public userService: UserService
  ) {}
  
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
    this.toast.availableSoon();
  }

  logout() {
    this.userService.logout();
  }
}
