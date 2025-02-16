import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  AccessSphereResponse,
  User,
} from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  ProfileSettings,
  RegEx,
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
  standalone: false,
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  updateUserSubscribe: Subscription = new Subscription();
  forgotSubscribe: Subscription = new Subscription();
  resetSubscribe: Subscription = new Subscription();

  @Input('modalId') modalId: string = '';
  @Input('profileConst') profileConst: string = '';
  @Input('user') user?: User;
  username: string = '';
  email: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  repetePassword: string = '';
  warning: boolean = false;

  isPasswordShow: boolean = false;

  forgotPasswordCheck: boolean = false;
  resetPasswordCheck: boolean = false;
  emailMatchWarning: boolean = false;
  resetCode: string = '';
  private EMPTY: string = '';

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
    this.forgotSubscribe.unsubscribe();
    this.resetSubscribe.unsubscribe();
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
        const response: AccessSphereResponse = new AccessSphereResponse();
        response.user = res.data;
        this.userService.setUserGlobally(response);
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
      this.resetInputDatas();
    }, 100);
  }

  forgotPassword() {
    const currentEmail = UserService.getUserData().email;
    if (this.email != currentEmail) {
      this.emailMatchWarning = true;
      return;
    } else this.emailMatchWarning = false;
    const body = {
      templateId: 'MONEYSTATS_CODE_RESET_PASSWORD',
      email: this.email,
    };
    const user = this.authService.forgotPassword(this.email, body);
    this.forgotSubscribe = user.subscribe((data) => {
      LOG.info(data.message!, 'ProfileSettingsComponent');
      SwalService.toastMessage(SwalIcon.SUCCESS, data.message!);
      this.resetPasswordCheck = true;
    });
  }

  validateRegexEmail() {
    const regex: RegExp = new RegExp(RegEx.EMAIL);
    // Se l' email è vuota non mostro l'errore
    return this.email != this.EMPTY ? regex.test(this.email) : true;
  }

  validateRegexPassword() {
    const regex: RegExp = new RegExp(RegEx.PASSWORD_FULL);
    // Se la password è vuota non mostro l'errore
    return this.newPassword != this.EMPTY ? regex.test(this.newPassword) : true;
  }

  hideShowPassword() {
    this.isPasswordShow
      ? (this.isPasswordShow = false)
      : (this.isPasswordShow = true);
  }

  resetPassword() {
    const user = this.authService.resetPassword(
      this.newPassword,
      this.resetCode
    );
    this.resetSubscribe = user.subscribe((data) => {
      LOG.info(data.message!, 'ProfileSettingsComponent');
      SwalService.toastMessage(SwalIcon.SUCCESS, data.message!);
      this.resetInputDatas();
    });
  }

  resetInputDatas() {
    this.email = this.EMPTY;
    this.username = this.EMPTY;
    this.oldPassword = this.EMPTY;
    this.newPassword = this.EMPTY;
    this.repetePassword = this.EMPTY;
    this.resetCode = this.EMPTY;
    this.forgotPasswordCheck = false;
    this.resetPasswordCheck = false;
  }
}
