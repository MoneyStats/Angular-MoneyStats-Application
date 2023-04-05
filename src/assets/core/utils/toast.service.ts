import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  environment = environment;
  constructor() {}

  availableSoon() {
    toastbox('soon');
  }

  closeToast() {
    closeToastBox('soon');
  }

  updateAvaiable() {
    toastbox('update');
  }

  closeUpdateToast() {
    closeToastBox('update');
  }

  copiedAvaiable() {
    toastbox('copied');
  }

  closeCopiedToast() {
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
