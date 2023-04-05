import { Component, OnInit, Output } from '@angular/core';
import { fader } from 'src/app/shared/animations/route-animations';
import { User } from 'src/assets/core/data/class/user.class';
import {
  ModalConstant,
  ProfileSettings,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { SwalIcon } from 'src/assets/core/data/constant/swal.icon';
import { UserService } from 'src/assets/core/services/user.service';
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
export class SettingsComponent implements OnInit {
  environment = environment;
  @Output('profileConst') profileConst: string = '';
  user?: User;

  warning: boolean = false;

  constructor(
    public screenService: ScreenService,
    private userService: UserService,
    private themeService: ThemeService,
    private toast: ToastService,
    private swal: SwalService
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

  onFileSelected(event: any): void {
    this.warning = false;
    let file: File = event.target.files[0];
    //this.wallet.image = this.fileUpload.append(file.name, file, file.name);
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

      this.userService.uploadImage(file).subscribe((data) => {
        this.user!.imgName = undefined;
        this.userService.updateUserData(this.user!).subscribe((res) => {
          this.userService.user! = res.data;
          this.userService.setUserGlobally();
          this.userService.setValue();
          this.swal.toastMessage(SwalIcon.SUCCESS, res.message!);
        });
      });
    } else if (file.size > environment.imageSizeMax) {
      this.warning = true;
    }
  }
}
