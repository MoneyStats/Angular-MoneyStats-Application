import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguagesSettings } from 'src/assets/core/data/constant/constant';
import { ThemeService } from 'src/assets/core/utils/theme.service';
import { fader, slideUp } from './shared/animations/route-animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        // <-- add your animations here
        fader,
        slideUp,
        // transformer,
    ],
    standalone: false
})
export class AppComponent implements OnInit {
  public showHeader: boolean = true;
  constructor(
    private translate: TranslateService,
    private contexts: ChildrenOutletContexts
  ) {
    this.setLanguages();
  }
  ngOnInit(): void {
    ThemeService.darkMode();
  }
  setLanguages() {
    let languages = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);
    if (!languages) {
      languages = this.changeLanguages(navigator.language);
    }
    // Fix old lang settings
    if (languages == 'en' || languages == 'it') {
      languages = LanguagesSettings.ENGLISH;
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

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
