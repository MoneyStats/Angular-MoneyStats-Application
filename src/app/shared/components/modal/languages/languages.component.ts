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

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    let languages = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);
    if (languages && languages === LanguagesSettings.ENGLISH)
      this.english = true;
  }
}
