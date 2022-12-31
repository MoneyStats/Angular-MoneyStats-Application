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

  updateUser() {
    if (this.username != '') {
      this.user!.username = this.username;
    }
    if (this.email != '') {
      this.user!.email = this.email;
    }
    if (
      this.oldPassword != '' &&
      this.newPassword != '' &&
      this.repetePassword != ''
    ) {
      this.user!.password = this.newPassword;
    }
    this.userService.user = this.user!;
  }

  validate(): boolean {
    let validate = false;
    if (
      this.oldPassword != '' &&
      this.newPassword != '' &&
      this.repetePassword != ''
    )
      validate = true;
    else validate = false;
    if (this.oldPassword === this.newPassword) validate = true;
    else validate = false;
    console.log(validate);
    return validate;
  }
}
