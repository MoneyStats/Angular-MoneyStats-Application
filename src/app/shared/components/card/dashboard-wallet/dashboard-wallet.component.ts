import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Coin, CoinSymbol } from 'src/assets/core/data/class/coin';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/modal.constant';
import { UserService } from 'src/assets/core/services/user.service';
import { ToastService } from 'src/assets/core/utils/toast.service';

@Component({
  selector: 'app-dashboard-wallet',
  templateUrl: './dashboard-wallet.component.html',
  styleUrls: ['./dashboard-wallet.component.scss'],
})
export class DashboardWalletComponent implements OnInit {
  @Input('dashboard') dashboard?: Dashboard;
  @Input('user') user?: User;
  @Input('value') value?: string;

  constructor(private toast: ToastService, private us: UserService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  availableSoon() {
    this.toast.availableSoon();
  }
}
