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
import { Asset } from 'src/assets/core/data/class/crypto.class';
import { Category, Wallet } from 'src/assets/core/data/class/dashboard.class';
import {
  AppConfigConst,
  ModalConstant,
} from 'src/assets/core/data/constant/constant';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { DashboardService } from 'src/assets/core/services/dashboard.service';
import { UserService } from 'src/assets/core/services/user.service';
import { WalletService } from 'src/assets/core/services/wallet.service';
import { SwalService } from 'src/assets/core/utils/swal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-asset-modal',
  templateUrl: './add-asset-modal.component.html',
  styleUrls: ['./add-asset-modal.component.scss'],
})
export class AddAssetModalComponent implements OnInit {
  environment = environment;
  @Input('modalId') modalId: string = '';
  @Output('emitAddWallet') emitAddWallet = new EventEmitter<Wallet>();
  @Input('categoriesInput') categoriesInput?: Category[];

  @Input('wallet') wallet: Wallet = new Wallet();
  @Input('asset') asset: Asset = new Asset();
  @Input('isCrypto') isCrypto: boolean = false;

  cryptoTypes: string[] = ['Holding', 'Trading'];
  cryptoPrices: Asset[] = [];
  filterCryptoPrices: Asset[] = [];
  search: string = '';

  categories: Category[] = [];

  falseIf: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private swalService: SwalService,
    private translate: TranslateService,
    private walletService: WalletService,
    private userService: UserService,
    private cryptoService: CryptoService
  ) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.categories = this.dashboardService.dashboard.categories;
    this.getCryptoPrices();
  }


  getCryptoPrices() {
    this.cryptoService.getCryptoPrice().subscribe((data) => {
      this.cryptoPrices = data.data;
      this.filterCryptoPrices = data.data;
    });
  }

  filterCryptoPrice(filter: string) {
    this.filterCryptoPrices = this.cryptoPrices.filter(
      (cp) => cp.name?.includes(filter) || cp.symbol?.includes(filter)
    );
  }

  onKeySearch(event: any) {
    setTimeout(() => {
      this.filterCryptoPrice(this.search);
    }, 1000);
  }


}
