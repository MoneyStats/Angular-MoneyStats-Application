import { Component, OnInit } from '@angular/core';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  environment = environment;

  constructor() {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  availableSoon() {
    ToastService.availableSoon();
  }

  goToDashboard() {
    Utils.vibrate();
    ScreenService.goToDashboard();
  }

  goToWallet() {
    Utils.vibrate();
    ScreenService.goToWallet();
  }

  goToSettings() {
    Utils.vibrate();
    ScreenService.goToSettings();
  }

  goToStats() {
    Utils.vibrate();
    ScreenService.goToStats();
  }

  vibrate() {
    Utils.vibrate();
  }
}
