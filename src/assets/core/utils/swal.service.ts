import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { StorageConstant } from '../data/constant/constant';
import { SwalIcon } from '../data/constant/swal.icon';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  githubAccount: any;
  walletImg?: string;

  environment = environment;
  private BACKGROUND_COLOR: string = 'rgba(56, 62, 66, 1)';
  private BACKDROP_COLOR: string = 'rgba(0, 0, 0, 0.5)';
  private TEXT_COLOR: string = '#FFFFFF';

  constructor() {}

  toastMessage(icon: any, message: string) {
    const Toast = Swal.mixin({
      customClass: {
        popup: 'border_round',
      },
      toast: true,
      position: 'top-end',
      color: this.TEXT_COLOR,
      background: this.BACKGROUND_COLOR,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: icon,
      title: message,
    });
  }

  confirmDialog(
    title: string,
    text: string,
    confirmButtonText: string,
    denyButtonText: string
  ): any {
    const customClassSwal = Swal.mixin({
      customClass: {
        confirmButton: 'rounded-pill buttonInput',
        denyButton: 'rounded-pill buttonInput',
        popup: 'border_round',
      },
      buttonsStyling: true,
    });
    return customClassSwal.fire({
      icon: SwalIcon.QUESTION,
      title: title,
      text: text,
      color: this.TEXT_COLOR,
      background: this.BACKGROUND_COLOR,
      backdrop: this.BACKDROP_COLOR,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: confirmButtonText,
      denyButtonText: denyButtonText,
    });
  }

  /*
    this.swalService
      .confirmDialog(
        this.translate
          .instant('contact.send_email.title')
          .replace('$NAME$', this.name),
        '',
        this.translate.instant('contact.send_email.send'),
        this.translate.instant('contact.send_email.not_send')
      )
      .then(async (result: any) => {
        if (result.isConfirmed) {
          ...
        } else if (result.isDenied) {
          ...
        }
  */

  simpleDialog(icon: any, title: string, text: string) {
    const customClassSwal = Swal.mixin({
      customClass: {
        confirmButton: 'rounded-pill buttonInput',
        popup: 'border_round',
      },
      buttonsStyling: true,
    });
    customClassSwal.fire({
      icon: icon,
      title: title,
      text: text,
      color: this.TEXT_COLOR,
      background: this.BACKGROUND_COLOR,
      backdrop: this.BACKDROP_COLOR,
    });
  }

  addImageSwal(
    title: string,
    text: string,
    confirmButtonText: string,
    denyButtonText: string
  ) {
    const customClassSwal = Swal.mixin({
      customClass: {
        input: 'rounded-pill',
        confirmButton: 'rounded-pill buttonInput',
        cancelButton: 'rounded-pill buttonInput',
        popup: 'border_round',
      },
      buttonsStyling: true,
    });
    customClassSwal
      .fire({
        icon: SwalIcon.WARNING,
        title: title,
        text: text,
        color: this.TEXT_COLOR,
        background: this.BACKGROUND_COLOR,
        backdrop: this.BACKDROP_COLOR,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        denyButtonText: denyButtonText,
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
        },
        showLoaderOnConfirm: true,
        preConfirm: (imageUrl) => {
          return fetch(`${imageUrl}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response.blob();
            })
            .then((imageBlob) => {
              // Then create a local URL for that image and print it
              const imageObjectURL = URL.createObjectURL(imageBlob);
              return imageUrl;
            })
            .catch((error) => {
              Swal.showValidationMessage(`Request failed: ${error}`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          const customClassSwal = Swal.mixin({
            customClass: {
              image: 'border_round',
              confirmButton: 'rounded-pill buttonInput',
              popup: 'border_round',
            },
            buttonsStyling: true,
          });
          customClassSwal.fire({
            title: `${
              result.value.split('/')[result.value.split('/').length - 1]
            }`,
            imageUrl: `${result.value}`,
            imageHeight: 200,
            imageAlt: 'Custom image',
            color: this.TEXT_COLOR,
            background: this.BACKGROUND_COLOR,
            backdrop: this.BACKDROP_COLOR,
          });
        }
        this.walletImg = result.value;
      });
  }

  syncGithubUser(user: string) {
    const customClassSwal = Swal.mixin({
      customClass: {
        image: 'border_round',
        input: 'rounded-pill',
        confirmButton: 'rounded-pill buttonInput',
        cancelButton: 'rounded-pill buttonInput',
        popup: 'border_round',
      },
      buttonsStyling: true,
    });
    customClassSwal
      .fire({
        title: `Get data from Github for ${user}`,
        color: this.TEXT_COLOR,
        background: this.BACKGROUND_COLOR,
        backdrop: this.BACKDROP_COLOR,
        showCancelButton: true,
        confirmButtonText: 'Connect',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return fetch(`//api.github.com/users/${user}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response.json();
            })
            .catch((error) => {
              Swal.showValidationMessage(`Request failed: ${error}`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.githubAccount = result.value;
          customClassSwal.fire({
            title: `${result.value.login}'s user`,
            imageUrl: result.value.avatar_url,
            imageHeight: 200,
            color: this.TEXT_COLOR,
            background: this.BACKGROUND_COLOR,
            backdrop: this.BACKDROP_COLOR,
            confirmButtonText: 'Confirm',
          });
        }
        this.githubAccount = result.value;
        this.githubAccount.username = result.value?.login;
        localStorage.setItem(
          StorageConstant.GITHUBACCOUNT,
          JSON.stringify(result.value)
        );
      });
  }
}
