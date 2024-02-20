import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Category, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  AppConfigConst,
  ModalConstant,
} from 'src/assets/core/data/constant/constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss'],
})
export class AddWalletComponent implements OnInit, OnChanges, OnDestroy {
  addWalletSub: Subscription = new Subscription();
  updateuserSub: Subscription = new Subscription();

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

  isImportWallet: boolean = false;
  isNewWallet: boolean = false;
  @Input('wallets') wallets: Wallet[] = [];
  walletName: string = '';
  notCryptoWallets: Wallet[] = [];

  constructor(
    private dashboardService: DashboardService,
    private swalService: SwalService,
    private translate: TranslateService,
    private walletService: WalletService,
    private userService: UserService,
    private logger: LoggerService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnDestroy(): void {
    this.addWalletSub.unsubscribe();
    this.updateuserSub.unsubscribe();
  }

  ngOnInit(): void {
    if (
      this.modalId == ModalConstant.EDITWALLET &&
      this.wallet.category == 'Crypto'
    ) {
      this.isNewWallet = true;
      this.isCrypto = true;
    }
    this.categories = this.dashboardService.dashboard.categories;
    if (this.wallets && this.wallets.length == 0) {
      this.wallets = this.dashboardService.dashboard.wallets;
    }
    this.filterWallet();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.walletImg == '' &&
      this.wallet.img !=
        environment.baseUrlHeader + AppConfigConst.DEFAULT_WALLET_IMG
    ) {
      this.walletImg = this.wallet.img;
    }
    if (this.isCrypto) {
      this.wallet.category = 'Crypto';
    }
    this.filterWallet();
  }

  filterWallet() {
    if (this.wallets) {
      this.notCryptoWallets = this.wallets.filter(
        (w) => w.category != 'Crypto'
      );
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
    if (
      walletToSave.history &&
      walletToSave.history.find((w) => w.id === undefined)
    ) {
      walletToSave?.history.splice(0, 1);
    }

    if (walletToSave.fileImage != undefined && walletToSave.fileImage.name) {
      walletToSave.imgName = walletToSave.fileImage.name;

      this.updateuserSub = this.userService
        .uploadImage(walletToSave.fileImage)
        .subscribe((data) => {
          this.logger.LOG(data.message!, 'AddWalletComponent');
          this.addWalletSub = this.walletService
            .addUpdateWalletData(walletToSave)
            .subscribe((data) => {
              this.logger.LOG(data.message!, 'AddWalletComponent');
              this.wallet.img = data.data.img;
              // Save Wallet
              this.emitAddWallet.emit(data.data);
            });
        });
    } else {
      this.addWalletSub = this.walletService
        .addUpdateWalletData(walletToSave)
        .subscribe((data) => {
          this.logger.LOG(data.message!, 'AddWalletComponent');
          // Save Wallet
          this.emitAddWallet.emit(data.data);
        });
    }

    if (!walletToSave.id) {
      this.wallet = new Wallet();
    }
    this.resetForm();
  }

  validateBtn(): boolean {
    let categoryValidation = this.wallet.category ? true : false;
    let imageValidation =
      (this.checkbox && this.defaultImg) || (!this.checkbox && !this.defaultImg)
        ? true
        : false;
    if (this.modalId != ModalConstant.EDITWALLET && !this.isImportWallet)
      return categoryValidation && imageValidation ? true : false;
    else return categoryValidation;
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

  importWallet() {
    this.wallet = this.wallets.find((w) => w.name == this.walletName)!;
    this.wallet.category = 'Crypto';
    this.walletImg = this.wallet.img;
    this.isNewWallet = true;
  }

  //@HostListener('document:click', ['$event', '$event.target'])
  resetForm() {
    this.walletName = '';
    this.isNewWallet = false;
    this.isImportWallet = false;
    this.warning = false;
    this.walletImg = '';
    this.checkbox = true;
    this.defaultImg = false;
    this.swalService.walletImg = undefined;
    this.wallet = new Wallet();
    this.wallets = [];
  }
}
