import { Component, OnInit } from '@angular/core';
import { User } from 'src/assets/core/data/class/user.class';
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

  ngOnInit(): void {
    this.screenService.setupHeader();
    this.user = this.userService.user;
    this.themeService.switchDarkMode();
  }
}
