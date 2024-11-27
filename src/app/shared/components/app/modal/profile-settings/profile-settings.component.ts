import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  ProfileSettings,
} from 'src/assets/core/data/constant/constant';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { SwalService } from 'src/assets/core/utils/swal.service';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
    standalone: false
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  updateUserSubscribe: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  @Input('profileConst') profileConst: string = '';
  @Input('user') user?: User;
  username: string = '';
  email: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  repetePassword: string = '';
  warning: boolean = false;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private userService: UserService
  ) {}

  public get profileConstant(): typeof ProfileSettings {
    return ProfileSettings;
  }

  ngOnInit(): void {
    if (this.user === undefined) {
      this.user = this.authService.user;
    }
  }

  ngOnDestroy(): void {
    this.updateUserSubscribe.unsubscribe();
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
      if (this.newPassword === this.repetePassword)
        this.user!.password = this.newPassword;
      else {
        this.warning = true;
        return;
      }
    }

    this.updateUserSubscribe = this.authService
      .updateUserData(this.user!)
      .subscribe((res) => {
        LOG.info(res.message!, 'ProfileSettingsComponent');
        this.userService.setUserGlobally(res.data);
        //this.authService.user! = res.data;
        //this.authService.setUserGlobally();
        //this.authService.setValue();
        SwalService.toastMessage(
          SwalIcon.SUCCESS,
          this.translate.instant('response.user')
        );
      });
    // DELETE PASSWORD
    this.user!.password = '';

    this.authService.user = this.user!;
    this.warning = false;
    var a = document.getElementById(ModalConstant.PROFILESETTINGS);
    setTimeout(() => {
      a?.classList.remove('show');
      a?.click();
      this.email = '';
      this.username = '';
      this.oldPassword = '';
      this.newPassword = '';
      this.repetePassword = '';
    }, 100);
  }
}
