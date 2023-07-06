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
import { InfoModalComponent } from './modal/info-modal/info-modal.component';

@NgModule({
  declarations: [
    AddAssetModalComponent,
    OperationsModalComponent,
    SelectCryptoCurrencyComponent,
    AddCryptoStatsComponent,
    AddCryptoOperationComponent,
    InfoModalComponent,
  ],
  exports: [
    AddAssetModalComponent,
    OperationsModalComponent,
    SelectCryptoCurrencyComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
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
