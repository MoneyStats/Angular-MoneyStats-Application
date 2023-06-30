import { Component, OnInit } from '@angular/core';
import { LanguagesSettings } from 'src/assets/core/data/constant/constant';
import { LoggerService } from 'src/assets/core/utils/log.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.cleanLocalStorage();
  }

  cleanLocalStorage() {
    // Check della lingua se già settata nel localstorage
    let languages = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);

    this.logger.LOG(
      'Cleaning localStorage and getting language: ' + languages,
      'AuthComponent'
    );
    // Cancello lo storage
    localStorage.clear();
    if (languages) {
      // Se lo storage conteneva una lingua la inserisco nuovamente
      localStorage.setItem(LanguagesSettings.ATTR_LANGUAGE, languages);
    }
  }
}
