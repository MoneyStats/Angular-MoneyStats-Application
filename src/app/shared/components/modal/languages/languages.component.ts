import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguagesSettings } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  english: boolean = false;
  italian: boolean = false;

  constructor(private translate: TranslateService) {}

  public get languagesSettings(): typeof LanguagesSettings {
    return LanguagesSettings;
  }

  ngOnInit(): void {
    let languages = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);
    if (languages && languages === LanguagesSettings.ENGLISH)
      this.english = true;
    else if (languages && languages === LanguagesSettings.ITALIAN)
      this.italian = true;
  }

  changeLanguages(lan: string) {
    this.translate.setDefaultLang(lan);
    localStorage.setItem(LanguagesSettings.ATTR_LANGUAGE, lan);

    if (lan == LanguagesSettings.ENGLISH) {
      this.english = true;
      this.italian = false;
    } else if (lan == LanguagesSettings.ITALIAN) {
      this.english = false;
      this.italian = true;
    }
  }
}
