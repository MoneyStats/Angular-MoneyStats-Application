import { Component, OnInit, Output } from '@angular/core';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  ProfileSettings,
} from 'src/assets/core/data/constant/modal.constant';
import { UserService } from 'src/assets/core/services/user.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ThemeService } from 'src/assets/core/utils/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Output('profileConst') profileConst: string = '';
  user?: User;
  constructor(
    public screenService: ScreenService,
    private userService: UserService,
    private themeService: ThemeService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get profileSettings(): typeof ProfileSettings {
    return ProfileSettings;
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.goToSettings();
    this.user = this.userService.user;
    this.themeService.switchDarkMode();
  }

  openAccountSettings(profileConst: string) {
    this.profileConst = profileConst;
  }
}
