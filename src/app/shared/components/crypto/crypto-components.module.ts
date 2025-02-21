import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.module';
import { HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { RouterModule } from '@angular/router';
import { AddAssetModalComponent } from './modal/add-asset-modal/add-asset-modal.component';
import { OperationsModalComponent } from './modal/operations-modal/operations-modal.component';
import { SelectCryptoCurrencyComponent } from './modal/select-crypto-currency/select-crypto-currency.component';
import { AddCryptoStatsComponent } from './modal/operations-modal/add-crypto-stats/add-crypto-stats.component';
import { AddCryptoOperationComponent } from './modal/operations-modal/add-crypto-operation/add-crypto-operation.component';
import { AssetSelectComponent } from './asset-select/asset-select.component';
import { OperationDetailsComponent } from './modal/operation-details/operation-details.component';
import { OperationsListComponent } from './operations-list/operations-list.component';
import { CloseOperationComponent } from './modal/close-operation/close-operation.component';
import { MarketDataTableComponent } from './market-data-table/market-data-table.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AddAssetModalComponent,
    OperationsModalComponent,
    SelectCryptoCurrencyComponent,
    AddCryptoStatsComponent,
    AddCryptoOperationComponent,
    AssetSelectComponent,
    OperationDetailsComponent,
    OperationsListComponent,
    CloseOperationComponent,
    MarketDataTableComponent,
  ],
  exports: [
    AddAssetModalComponent,
    OperationsModalComponent,
    SelectCryptoCurrencyComponent,
    AssetSelectComponent,
    OperationDetailsComponent,
    OperationsListComponent,
    CloseOperationComponent,
    MarketDataTableComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
})
export class CryptoComponentsModule {}
