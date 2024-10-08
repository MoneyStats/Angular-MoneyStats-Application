import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  environment = environment;
  constructor() {}

  public static availableSoon() {
    toastbox('soon');
  }

  public static closeToast() {
    closeToastBox('soon');
  }

  public static updateAvaiable() {
    toastbox('update');
  }

  public static closeUpdateToast() {
    closeToastBox('update');
  }

  public static copiedAvaiable() {
    toastbox('copied');
  }

  public static closeCopiedToast() {
    closeToastBox('copied');
  }
}

var toastBoxes = document.querySelectorAll('.toast-box');

function toastbox(target: any) {
  var a = document.getElementById(target);
  closeToastBox(target);
  setTimeout(() => {
    a?.classList.add('show');
  }, 100);
}

function closeToastBox(target: any) {
  var a = document.getElementById(target);
  setTimeout(() => {
    a?.classList.remove('show');
  }, 100);
}
