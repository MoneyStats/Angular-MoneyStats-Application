import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { HttpLoaderFactory } from 'src/app/app.module';
import { InterceptorsModule } from 'src/app/interceptors/interceptors.module';
import { CryptoDashboardComponent } from './crypto-dashboard/crypto-dashboard.component';
import { CryptoComponent } from './crypto.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { CryptoComponentsModule } from 'src/app/shared/components/crypto/crypto-components.module';
import { SharedModule } from 'src/app/shared/components/shared/shared.module';
import { CoreModule } from 'src/app/shared/components/core/core.module';
import { CryptoRoutingModule } from './crypto-routing.module';
import { CryptoAssetComponent } from './crypto-asset/crypto-asset.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    CryptoDashboardComponent,
    CryptoComponent,
    RequirementsComponent,
    CryptoAssetComponent,
  ],
  imports: [
    CryptoRoutingModule,
    CommonModule,
    CoreModule,
    CryptoComponentsModule,
    NgApexchartsModule,
    NgChartsModule,
    SharedModule,
    IonicModule.forRoot(),
    FormsModule,
    InterceptorsModule,
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
export class CryptoModule {}
