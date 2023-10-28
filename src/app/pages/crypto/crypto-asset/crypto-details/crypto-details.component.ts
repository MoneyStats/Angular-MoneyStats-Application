import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import {
  Asset,
  CryptoDashboard,
} from 'src/assets/core/data/class/crypto.class';
import { CryptoService } from 'src/assets/core/services/crypto.service';
import { LoggerService } from 'src/assets/core/utils/log.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';
import { StorageConstant } from 'src/assets/core/data/constant/constant';

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.scss'],
})
export class CryptoDetailsComponent implements OnInit {
  amount: string = '******';
  hidden: boolean = false;
  cryptoDashboard: CryptoDashboard = new CryptoDashboard();
  @Output('asset') asset: Asset = new Asset();
  @Output('assetName') assetName: string = '';

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private screenService: ScreenService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.screenService.hideFooter();
    this.cryptoDashboard = deepCopy(this.cryptoService.cryptoDashboard);
    let assets = [...this.cryptoService.assets];
    //let assets = deepCopy(this.cryptoDashboard.assets);
    this.route.params.subscribe((a: any) => {
      this.assetName = a.identifier;
      if (assets.length != 0) {
        this.asset = assets.find((as) => as.identifier == a.identifier)!;
      } else {
        this.cryptoService
          .getCryptoDetails(a.identifier)
          .subscribe((details) => {
            this.logger.LOG(details.message!, 'CryptoDetailsComponent');
            this.asset = details.data;
            this.cryptoService.asset = details.data;
          });
      }
    });
    this.isWalletBalanceHidden();
  }

  isWalletBalanceHidden() {
    let isHidden = JSON.parse(
      localStorage.getItem(StorageConstant.HIDDENAMOUNT)!
    );
    if (isHidden != null) {
      this.hidden = isHidden;
    }
  }
}
