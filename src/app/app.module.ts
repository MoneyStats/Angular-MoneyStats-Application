import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/core/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './shared/components/core/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AvailableSoonComponent } from './shared/components/modal/available-soon/available-soon.component';
import { DashboardWalletComponent } from './shared/components/card/dashboard-wallet/dashboard-wallet.component';
import { StatsCardComponent } from './shared/components/card/stats-card/stats-card.component';
import { DatePipe } from '@angular/common';
import { TransactionCardComponent } from './shared/components/card/transaction-card/transaction-card.component';
import { ContentBoxComponent } from './shared/components/card/content-box/content-box.component';
import { SplideSlideComponent } from './shared/components/card/splide-slide/splide-slide.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HeaderMobileComponent } from './shared/components/core/header-mobile/header-mobile.component';
import { TransactionDetailsComponent } from './pages/transactions/transaction-details/transaction-details.component';
import { ErrorHandleComponent } from './interceptors/error-handle/error-handle.component';
import { HttpErrorInterceptor } from 'src/assets/core/interceptors/error.inteceptor';
import { WalletComponent } from './pages/wallet/wallet.component';
import { WalletCardComponent } from './shared/components/card/wallet-card/wallet-card.component';
import { WalletDetailsComponent } from './pages/wallet/wallet-details/wallet-details.component';
import { TitleDesktopComponent } from './shared/components/core/title-desktop/title-desktop.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    AvailableSoonComponent,
    DashboardWalletComponent,
    StatsCardComponent,
    TransactionCardComponent,
    ContentBoxComponent,
    SplideSlideComponent,
    TransactionsComponent,
    HeaderMobileComponent,
    TransactionDetailsComponent,
    ErrorHandleComponent,
    WalletComponent,
    WalletCardComponent,
    WalletDetailsComponent,
    TitleDesktopComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    HttpClientModule,
    NgApexchartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    environment.baseUrl + 'assets/i18n/',
    '.json'
  );
}
