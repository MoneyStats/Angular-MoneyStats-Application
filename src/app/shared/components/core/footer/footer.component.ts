import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalConstant } from 'src/assets/core/data/constant/constant';
import { AppService } from 'src/assets/core/services/app.service';
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

  constructor(
    public toast: ToastService,
    private screenService: ScreenService,
    private appService: AppService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {}

  availableSoon() {
    this.toast.availableSoon();
  }

  goToDashboard() {
    this.appService.vibrate();
    this.screenService.goToDashboard();
  }

  goToWallet() {
    this.appService.vibrate();
    this.screenService.goToWallet();
  }

  goToSettings() {
    this.appService.vibrate();
    this.screenService.goToSettings();
  }

  goToStats() {
    this.appService.vibrate();
    this.screenService.goToStats();
  }

  vibrate() {
    this.appService.vibrate();
  }
}
