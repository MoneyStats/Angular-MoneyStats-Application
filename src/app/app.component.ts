import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguagesSettings } from 'src/assets/core/data/constant/constant';
import { ThemeService } from 'src/assets/core/utils/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public showHeader: boolean = true;
  constructor(
    private translate: TranslateService,
    private themeService: ThemeService
  ) {
    this.setLanguages();
  }
  ngOnInit(): void {
    this.themeService.darkMode();
  }
  setLanguages() {
    let languages = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);
    if (!languages) {
      languages = this.changeLanguages(navigator.language);
    }
    this.translate.setDefaultLang(languages);
    localStorage.setItem(LanguagesSettings.ATTR_LANGUAGE, languages);
  }

  changeLanguages(lan: string): LanguagesSettings {
    if (lan == LanguagesSettings.ENGLISH) {
      return LanguagesSettings.ENGLISH;
    } else if (lan == LanguagesSettings.ITALIAN) {
      return LanguagesSettings.ITALIAN;
    } else return LanguagesSettings.ENGLISH;
  }
}
