import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Coin, CoinSymbol } from 'src/assets/core/data/class/coin';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
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
  amount: string = '******';
  hidden: boolean = false;
  @Output('changeAmountStatus') changeAmountStatus =
    new EventEmitter<boolean>();

  constructor(private toast: ToastService, private us: UserService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }

  availableSoon() {
    this.toast.availableSoon();
  }

  hiddenShowAmount() {
    if (this.hidden) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
    localStorage.setItem(StorageConstant.HIDDENAMOUNT, this.hidden.toString());
    this.changeAmountStatus.emit(this.hidden);
  }
}
