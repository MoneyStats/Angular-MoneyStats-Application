import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { AvailableSoonComponent } from '../../modal/available-soon/available-soon.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input('user') user?: User;
  @Input() dashboard?: Dashboard;
  constructor(
    private toast: ToastService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {}

  updateData(): void {
    this.dashboard = this.dashboardService.dashboard;
  }

  availableSoon() {
    this.toast.availableSoon();
  }
}
