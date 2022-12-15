import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/assets/core/data/class/user.class';
import { UserService } from 'src/assets/core/services/user.service';
import { ThemeService } from 'src/assets/core/utils/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public showHeader: boolean = true;
  @Output('user') user?: User = new User();
  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private themeService: ThemeService
  ) {
    translate.setDefaultLang('en');
  }
  ngOnInit(): void {
    this.themeService.darkMode();
    const user = this.userService.getUser();
    user.subscribe(async (data) => {
      this.user = data;
      this.userService.user = data;
      this.userService.setValue();
      this.userService.getGithubUser(this.user.github.username);
    });
    this.updateGithubData();
  }

  updateGithubData() {
    this.userService.updateGithubUser();
    if (this.userService.github === undefined) {
      setTimeout(() => {
        this.updateGithubData();
      }, 100 * 10);
    } else {
      this.user!.profilePhoto = this.userService.github.avatar_url;
    }
  }
}
