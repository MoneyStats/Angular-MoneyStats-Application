import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Category, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  AppConfigConst,
  ModalConstant,
} from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss'],
})
export class AddWalletComponent implements OnInit, OnChanges {
  environment = environment;
  @Input('modalId') modalId: string = '';
  @Output('emitAddWallet') emitAddWallet = new EventEmitter<Wallet>();
  @Input('categoriesInput') categoriesInput?: Category[];
  @Input('wallet') wallet: Wallet = new Wallet();
  @Input('isCrypto') isCrypto: boolean = false;

  cryptoTypes: string[] = ['Holding', 'Trading'];
  categories: Category[] = [];

  categorySelect: string = 'Select Category';

  defaultImg: boolean = false;
  checkbox: boolean = true;
  walletImg: string = '';
  warning: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private swalService: SwalService,
    private translate: TranslateService,
    private walletService: WalletService,
    private userService: UserService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.categories = this.dashboardService.dashboard.categories;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isCrypto) {
      this.wallet.category = 'Crypto';
    }
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

    if (walletToSave.fileImage != undefined && walletToSave.fileImage.name) {
      walletToSave.imgName = walletToSave.fileImage.name;

      this.userService.uploadImage(walletToSave.fileImage).subscribe((data) => {
        this.walletService.addUpdateWallet(walletToSave).subscribe((data) => {
          this.wallet.img = data.data.img;
          // Save Wallet
          this.emitAddWallet.emit(data.data);
        });
      });
    } else {
      this.walletService.addUpdateWallet(walletToSave).subscribe((data) => {
        // Save Wallet
        this.emitAddWallet.emit(data.data);
      });
    }

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

  onFileSelected(event: any): void {
    this.warning = false;
    let file: File = event.target.files[0];
    //this.wallet.image = this.fileUpload.append(file.name, file, file.name);
    if (
      event.target.files &&
      event.target.files[0] &&
      file.size < environment.imageSizeMax
    ) {
      this.wallet.fileImage = file;
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.walletImg = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.checkbox = false;
    } else if (file.size > environment.imageSizeMax) {
      this.warning = true;
    }
  }
}
