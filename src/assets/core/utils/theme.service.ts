import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  environment = environment;
  constructor() {}

  public static darkMode() {
    //localStorage.setItem('MoneyStatsDarkMode', '1');
    darkMode();
  }

  public static switchDarkMode() {
    switchDarkMode();
  }
}
const MoneyStats = {
  //-------------------------------------------------------------------
  // Dark Mode Settings
  Dark_Mode: {
    default: true, // Set dark mode as main theme
    local_mode: {
      // Activate dark mode between certain times of the day
      enable: false, // Enable or disable local dark mode
      start_time: 20, // Start at 20:00
      end_time: 7, // End at 07:00
    },
    auto_detect: {
      // Auto detect user's preferences and activate dark mode
      enable: false,
    },
  },
  //-------------------------------------------------------------------
};

//-----------------------------------------------------------------------
// Elements
//-----------------------------------------------------------------------
var pageBody = document.querySelector('body');
//-----------------------------------------------------------------------
function darkMode() {
  let darkModeStatus = localStorage.getItem('MoneyStatsDarkMode');
  if (!darkModeStatus && MoneyStats.Dark_Mode.default) {
    darkModeStatus = '1';
    localStorage.setItem('MoneyStatsDarkMode', '1');
  }

  if (darkModeStatus === '1') {
    // Check if enable as default
    if (MoneyStats.Dark_Mode.default) {
      pageBody?.classList.add('dark-mode');
    }

    // Local Dark Mode
    if (MoneyStats.Dark_Mode.local_mode.enable) {
      var nightStart = MoneyStats.Dark_Mode.local_mode.start_time;
      var nightEnd = MoneyStats.Dark_Mode.local_mode.end_time;
      var currentDate = new Date();
      var currentHour = currentDate.getHours();
      if (currentHour >= nightStart || currentHour < nightEnd) {
        // It is night time
        pageBody?.classList.add('dark-mode');
      }
    }

    // Auto Detect Dark Mode
    if (MoneyStats.Dark_Mode.auto_detect.enable)
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        pageBody?.classList.add('dark-mode');
      }
  }
}

function switchDarkMode() {
  //-----------------------------------------------------------------------
  // Dark Mode
  var switchDarkMode = document.querySelectorAll('.dark-mode-switch');
  var checkDarkModeStatus = localStorage.getItem('MoneyStatsDarkMode');
  var pageBodyActive = pageBody?.classList.contains('dark-mode');
  function switchDarkModeCheck(value: any) {
    switchDarkMode.forEach(function (el: any) {
      el.checked = value;
    });
  }
  // if dark mode on
  if (
    //checkDarkModeStatus === 1 ||
    checkDarkModeStatus === '1' ||
    pageBody?.classList.contains('dark-mode')
  ) {
    switchDarkModeCheck(true);
    if (pageBodyActive) {
      // dark mode already activated
    } else {
      pageBody?.classList.add('dark-mode');
    }
  } else {
    switchDarkModeCheck(false);
  }
  switchDarkMode.forEach(function (el) {
    el.addEventListener('click', function () {
      var darkmodeCheck = localStorage.getItem('MoneyStatsDarkMode');
      var bodyCheck = pageBody?.classList.contains('dark-mode');
      if (
        //darkmodeCheck === 1 ||
        darkmodeCheck === '1' ||
        bodyCheck
      ) {
        pageBody?.classList.remove('dark-mode');
        localStorage.setItem('MoneyStatsDarkMode', '0');
        switchDarkModeCheck(false);
      } else {
        pageBody?.classList.add('dark-mode');
        switchDarkModeCheck(true);
        localStorage.setItem('MoneyStatsDarkMode', '1');
      }
    });
  });
  //-----------------------------------------------------------------------
}
