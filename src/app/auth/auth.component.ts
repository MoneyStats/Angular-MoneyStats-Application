import { Component, OnInit } from '@angular/core';
import { LanguagesSettings } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let languages = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);
    localStorage.clear();
    if (languages) {
      localStorage.setItem(LanguagesSettings.ATTR_LANGUAGE, languages);
    }
  }
}
