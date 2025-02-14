import { Component, OnInit } from '@angular/core';
import {
  LanguagesSettings,
  StorageConstant,
} from 'src/assets/core/data/constant/constant';
import { LOG } from 'src/assets/core/utils/log.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false,
})
export class AuthComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    if (!window.location.href.includes('?code')) this.cleanLocalStorage();
  }

  cleanLocalStorage() {
    // Check della lingua se già settata nel localstorage
    let languages = localStorage.getItem(LanguagesSettings.ATTR_LANGUAGE);
    let autoUpdate = localStorage.getItem(StorageConstant.AUTOUPDATE);

    LOG.info(
      'Cleaning localStorage and getting language: ' +
        languages +
        ' and Auto Update Data ' +
        autoUpdate,
      'AuthComponent'
    );
    // Cancello lo storage
    localStorage.clear();
    if (languages) {
      // Se lo storage conteneva una lingua la inserisco nuovamente
      localStorage.setItem(LanguagesSettings.ATTR_LANGUAGE, languages);
    }
    if (autoUpdate) {
      // Se lo storage conteneva una lingua la inserisco nuovamente
      localStorage.setItem(StorageConstant.AUTOUPDATE, autoUpdate);
    }
  }
}
