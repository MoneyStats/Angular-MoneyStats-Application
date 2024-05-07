import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Github, User } from 'src/assets/core/data/class/user.class';
import {
  AppConfigConst,
  ModalConstant,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { AuthService } from 'src/assets/core/services/api/auth.service';
import { UserService } from 'src/assets/core/services/api/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social-details',
  templateUrl: './social-details.component.html',
  styleUrls: ['./social-details.component.scss'],
})
export class SocialDetailsComponent implements OnInit {
  @Input('username') username: string = '';
  @Input('modalId') modalId: string = '';
  @Output('emitDisconnect') emitDisconnect = new EventEmitter<User>();

  @Input('github') github: Github = new Github();
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.checkGithubAccount();
  }

  checkGithubAccount() {
    const githubAccount: any = localStorage.getItem(
      StorageConstant.GITHUBACCOUNT
    );
    if (this.userService.user.settings.github) {
      this.github = this.userService.user.settings.github!;
    } else if (githubAccount && githubAccount != 'undefined') {
      this.github = JSON.parse(githubAccount);
      this.github.username = this.github.login;
    }
    if (this.github) this.username = this.github.username!;
    else this.username = '';
  }

  syncGithubAccount() {
    this.userService.syncGithubUser(this.username);
  }

  disconnectGithubAccount() {
    localStorage.removeItem(StorageConstant.GITHUBACCOUNT);
    this.userService.user.profilePhoto =
      environment.baseUrlHeader + AppConfigConst.DEFAULT_USER_IMG;
    this.userService.user.settings.github = new Github();
    this.userService.user.settings.githubUser = undefined;
    this.authService.updateUserData(this.userService.user).subscribe((res) => {
      this.userService.user = res.data;
      this.emitDisconnect.emit(res.data);
    });
  }

  updateGithubData() {
    this.userService.updateGithubUser();
    if (this.userService.user.settings.github === undefined) {
      setTimeout(() => {
        this.updateGithubData();
      }, 100 * 10);
    } else {
      this.userService.user!.profilePhoto =
        this.userService.user.settings.github.avatar_url!;
    }
  }
}
