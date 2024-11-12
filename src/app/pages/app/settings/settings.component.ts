import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { fader } from 'src/app/shared/animations/route-animations';
import { Status, User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  ProfileSettings,
  StorageConstant,
  UserRole,
} from 'src/assets/core/data/constant/constant';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { AppService } from 'src/assets/core/services/api/app.service';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { CacheService } from 'src/assets/core/services/config/cache.service';
import { LOG } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { ThemeService } from 'src/assets/core/utils/theme.service';
import { ToastService } from 'src/assets/core/utils/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [fader],
})
export class SettingsComponent implements OnInit, OnDestroy {
  marketDataSubscribe: Subscription = new Subscription();
  cacheSubscribe: Subscription = new Subscription();
  updateUserSubscribe: Subscription = new Subscription();

  environment = environment;
  @Output('profileConst') profileConst: string = '';
  user?: User;

  warning: boolean = false;
  isAutoUpdate: boolean = false;
  isLiveWallet: boolean = false;

  constructor(
    public screenService: ScreenService,
    private authService: AuthService,
    private appService: AppService,
    private translate: TranslateService,
    private userService: UserService,
    private cacheService: CacheService
  ) {}

  ngOnDestroy(): void {
    this.marketDataSubscribe.unsubscribe();
    this.cacheSubscribe.unsubscribe();
    this.updateUserSubscribe.unsubscribe();
  }

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  public get userRole(): typeof UserRole {
    return UserRole;
  }

  public get profileSettings(): typeof ProfileSettings {
    return ProfileSettings;
  }

  ngOnInit(): void {
    ScreenService.setupHeader();
    ScreenService.showFooter();
    ScreenService.goToSettings();
    this.user = UserService.getUserData();
    ThemeService.switchDarkMode();
    if (this.user?.name === 'DEFAULT_NAME') {
      this.user = this.authService.user;
    }
    if (this.user?.name === 'DEFAULT_NAME') {
      this.user = UserService.getUserData();
    }
    let autoUpdate = !localStorage.getItem(StorageConstant.AUTOUPDATE);
    if (autoUpdate) {
      this.isAutoUpdate = autoUpdate;
    }
    if (this.user?.settings.liveWallets != undefined) {
      this.isLiveWallet =
        this.user.settings.liveWallets == Status.ACTIVE ? true : false;
    }
  }

  screenWidth() {
    return ScreenService.screenWidth;
  }

  disconnect(user: User) {
    this.user = user;
  }

  openAccountSettings(profileConst: string) {
    this.profileConst = profileConst;
  }

  availableSoon() {
    ToastService.availableSoon();
  }

  logout() {
    this.authService.logout();
  }

  onFileSelected(event: any): void {
    this.warning = false;
    let file: File = event.target.files[0];
    if (
      event.target.files &&
      event.target.files[0] &&
      file.size < environment.imageSizeMax
    ) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.user!.profilePhoto = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.user!.imgName = file.name;

      this.appService.uploadImage(file).subscribe((data) => {
        this.user!.imgName = undefined;
        this.authService.updateUserData(this.user!).subscribe((res) => {
          this.userService.setUserGlobally(res.data);
          SwalService.toastMessage(SwalIcon.SUCCESS, res.message!);
        });
      });
    } else if (file.size > environment.imageSizeMax) {
      this.warning = true;
    }
  }

  autoUpdate() {
    this.isAutoUpdate == true ? false : true;
    localStorage.setItem(
      StorageConstant.AUTOUPDATE,
      JSON.stringify(this.isAutoUpdate)
    );
  }

  cleanCache() {
    this.cacheSubscribe = this.appService.cleanCache().subscribe((res) => {
      LOG.info(res.message!, 'SettingsComponent');
      SwalService.toastMessage(
        SwalIcon.SUCCESS,
        this.translate.instant('response.cache')
      );
    });
  }

  importMarketData() {
    this.marketDataSubscribe = this.appService
      .importMarketData()
      .subscribe((res) => {
        LOG.info(res.message!, 'SettingsComponent');
        SwalService.toastMessage(
          SwalIcon.SUCCESS,
          this.translate.instant('response.marketData')
        );
      });
  }

  liveWallet() {
    this.cacheService.clearCache();
    if (this.user?.settings.liveWallets == undefined)
      this.user!.settings.liveWallets = Status.NOT_ACTIVE;
    else
      this.user!.settings.liveWallets =
        this.user?.settings.liveWallets &&
        this.user?.settings.liveWallets == Status.ACTIVE
          ? Status.NOT_ACTIVE
          : Status.ACTIVE;
    this.updateUser(
      this.translate.instant('response.live') +
        (this.user?.settings.liveWallets == 'ACTIVE' ? 'Active' : 'Not Active')
    );
    this.isLiveWallet == true ? false : true;
  }

  updateUser(message: string) {
    this.updateUserSubscribe = this.authService
      .updateUserData(this.user!)
      .subscribe((res) => {
        LOG.info(res.message!, 'SettingsComponent');
        this.userService.setUserGlobally(res.data);
        SwalService.toastMessage(SwalIcon.SUCCESS, message);
      });
  }
}
