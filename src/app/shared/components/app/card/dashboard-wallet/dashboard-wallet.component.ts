import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { CacheService } from 'src/assets/core/services/config/cache/cache.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-wallet',
  templateUrl: './dashboard-wallet.component.html',
  styleUrls: ['./dashboard-wallet.component.scss'],
  standalone: false,
})
export class DashboardWalletComponent implements OnInit {
  environment = environment;
  @Input('dashboard') dashboard?: Dashboard;
  @Input('user') user?: User;
  @Input('value') value?: string;
  amount: string = '******';
  hidden: boolean = false;
  @Output('changeAmountStatus') changeAmountStatus =
    new EventEmitter<boolean>();

  constructor(private cache: CacheService) {}

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
    ToastService.availableSoon();
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

  cleanCacheAndRefresh() {
    this.cache.clearCache();
    window.location.reload();
  }
}
