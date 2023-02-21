import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Category, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  AppConfigConst,
  ModalConstant,
} from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss'],
})
export class AddWalletComponent implements OnInit {
  environment = environment;
  @Input('modalId') modalId: string = '';
  @Output('emitAddWallet') emitAddWallet = new EventEmitter<Wallet>();
  @Input('categoriesInput') categoriesInput?: Category[];
  @Input('wallet') wallet: Wallet = new Wallet();
  categories: Category[] = [];

  categorySelect: string = 'Select Category';

  defaultImg: boolean = false;
  checkbox: boolean = true;
  walletImg: string = '';

  constructor(
    private dashboardService: DashboardService,
    private swalService: SwalService,
    private translate: TranslateService,
    private walletService: WalletService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.categories = this.dashboardService.dashboard.categories;
  }

  importimage() {
    this.swalService.addImageSwal(
      this.translate.instant('wallet.modal.imageModal.title'),
      this.translate.instant('wallet.modal.imageModal.subTitle'),
      this.translate.instant('wallet.modal.imageModal.continue'),
      this.translate.instant('wallet.modal.imageModal.cancel')
    );
    this.updateImageData();
  }

  updateImageData() {
    if (this.swalService.walletImg === undefined) {
      setTimeout(() => {
        this.updateImageData();
      }, 100 * 10);
    } else {
      this.walletImg = this.swalService.walletImg;
      if (this.walletImg === '') {
        this.walletImg =
          environment.baseUrlHeader + AppConfigConst.DEFAULT_WALLET_IMG;
      }
      this.checkbox = false;
    }
  }

  addUpdateWallet() {
    let walletToSave = this.wallet;

    if (!this.defaultImg) {
      walletToSave.img = this.walletImg;
    }
    // Edit Wallet keep same image
    if (this.defaultImg && walletToSave.id) {
      this.walletImg = walletToSave.img;
    }
    if (this.walletImg === '') {
      walletToSave.img =
        environment.baseUrlHeader + AppConfigConst.DEFAULT_WALLET_IMG;
    }
    if (walletToSave.history.find((w) => w.id === undefined)) {
      walletToSave?.history.splice(0, 1);
    }

    this.walletService.addUpdateWallet(walletToSave).subscribe((data) => {
      // Save Wallet
      this.emitAddWallet.emit(data.data);
    });
    if (!walletToSave.id) {
      this.wallet = new Wallet();
    }
    this.defaultImg = false;
    this.checkbox = true;
    this.walletImg = '';
    this.swalService.walletImg = undefined;
  }

  validateBtn(): boolean {
    let categoryValidation = this.wallet.category ? true : false;
    let imageValidation =
      (this.checkbox && this.defaultImg) || (!this.checkbox && !this.defaultImg)
        ? true
        : false;
    return categoryValidation && imageValidation ? true : false;
  }
}
