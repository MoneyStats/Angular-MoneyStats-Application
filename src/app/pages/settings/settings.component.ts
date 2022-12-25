import { Component, OnInit } from '@angular/core';
import { User } from 'src/assets/core/data/class/user.class';
import { ModalConstant } from 'src/assets/core/data/constant/modal.constant';
import { UserService } from 'src/assets/core/services/user.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { ThemeService } from 'src/assets/core/utils/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user?: User;
  constructor(
    public screenService: ScreenService,
    private userService: UserService,
    private themeService: ThemeService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.screenService.goToSettings();
    this.user = this.userService.user;
    this.themeService.switchDarkMode();
  }
}
