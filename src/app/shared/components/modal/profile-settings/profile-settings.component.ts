import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/assets/core/data/class/user.class';
import { ProfileSettings } from 'src/assets/core/data/constant/modal.constant';
import { UserService } from 'src/assets/core/services/user.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  @Input('profileConst') profileConst: string = '';
  @Input('user') user?: User;
  username: string = '';
  email: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  repetePassword: string = '';

  constructor(private userService: UserService) {}

  public get profileConstant(): typeof ProfileSettings {
    return ProfileSettings;
  }

  ngOnInit(): void {
    if (this.user === undefined) {
      this.user = this.userService.user;
    }
  }
}
