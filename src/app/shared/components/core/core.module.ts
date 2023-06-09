import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.module';
import { HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './header/header.component';
import { CryptoHeaderComponent } from './crypto-header/crypto-header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { TitleDesktopComponent } from './title-desktop/title-desktop.component';
import { RouterModule } from '@angular/router';
import { AppComponentsModule } from '../app/app-components.module';
import { SharedModule } from '../shared/shared.module';
import { CryptoComponentsModule } from '../crypto/crypto-components.module';

@NgModule({
  declarations: [
    HeaderComponent,
    CryptoHeaderComponent,
    FooterComponent,
    HeaderMobileComponent,
    TitleDesktopComponent,
  ],
  exports: [
    HeaderComponent,
    CryptoHeaderComponent,
    FooterComponent,
    HeaderMobileComponent,
    TitleDesktopComponent,
  ],
  imports: [
    RouterModule,
    CryptoComponentsModule,
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
    AppComponentsModule,
  ],
})
export class CoreModule {}
