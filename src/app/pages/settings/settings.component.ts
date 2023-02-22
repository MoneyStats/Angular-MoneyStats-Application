import { Component, OnInit, Output } from '@angular/core';
import { fader } from 'src/app/shared/animations/route-animations';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  ProfileSettings,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { UserService } from 'src/assets/core/services/user.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ThemeService } from 'src/assets/core/utils/theme.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [fader],
})
export class SettingsComponent implements OnInit {
  environment = environment;
  @Output('profileConst') profileConst: string = '';
  user?: User;
  constructor(
    public screenService: ScreenService,
    private userService: UserService,
    private themeService: ThemeService,
    private toast: ToastService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get profileSettings(): typeof ProfileSettings {
    return ProfileSettings;
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.showFooter();
    this.screenService.goToSettings();
    this.user = this.userService.user;
    this.themeService.switchDarkMode();
    if (this.user?.name === 'DEFAULT_NAME') {
      this.user = this.userService.user;
    }
    if (this.user?.name === 'DEFAULT_NAME') {
      this.user = JSON.parse(
        localStorage.getItem(StorageConstant.USERACCOUNT)!
      );
    }
  }

  disconnect(user: User) {
    this.user = user;
  }

  openAccountSettings(profileConst: string) {
    this.profileConst = profileConst;
  }

  availableSoon() {
    this.toast.availableSoon();
  }

  logout() {
    this.userService.logout();
  }
}
