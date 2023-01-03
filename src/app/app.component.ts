import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/assets/core/data/class/user.class';
import {
  LanguagesSettings,
  StorageConstant,
} from 'src/assets/core/data/constant/modal.constant';
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
    this.setLanguages();
  }
  ngOnInit(): void {
    this.themeService.darkMode();
    const user = this.userService.getUser();
    user.subscribe(async (data) => {
      this.user = data;
      this.userService.user = data;
      this.userService.setValue();
      localStorage.setItem(
        StorageConstant.GITHUBACCOUNT,
        JSON.stringify(data.github)
      );
    });
  }
  setLanguages() {
    let languages = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);
    if (!languages) languages = LanguagesSettings.ENGLISH;
    this.translate.setDefaultLang(languages);
    localStorage.setItem(LanguagesSettings.ATTR_LANGUAGE, languages);
  }
}
