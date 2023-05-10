import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/core/header/header.component';
import { DashboardComponent } from './pages/app/dashboard/dashboard.component';
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
import { AvailableSoonComponent } from './shared/components/app/modal/available-soon/available-soon.component';
import { DashboardWalletComponent } from './shared/components/app/card/dashboard-wallet/dashboard-wallet.component';
import { StatsCardComponent } from './shared/components/app/card/stats-card/stats-card.component';
import { DatePipe } from '@angular/common';
import { TransactionCardComponent } from './shared/components/shared/card/transaction-card/transaction-card.component';
import { ContentBoxComponent } from './shared/components/app/card/content-box/content-box.component';
import { SplideSlideComponent } from './shared/components/app/card/splide-slide/splide-slide.component';
import { TransactionsComponent } from './pages/app/transactions/transactions.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HeaderMobileComponent } from './shared/components/core/header-mobile/header-mobile.component';
import { TransactionDetailsComponent } from './pages/app/transactions/transaction-details/transaction-details.component';
import { ErrorHandleComponent } from './interceptors/error-handle/error-handle.component';
import { HttpErrorInterceptor } from 'src/assets/core/interceptors/error.inteceptor';
import { WalletComponent } from './pages/app/wallet/wallet.component';
import { WalletCardComponent } from './shared/components/app/wallet/wallet-card/wallet-card.component';
import { WalletDetailsComponent } from './pages/app/wallet/wallet-details/wallet-details.component';
import { TitleDesktopComponent } from './shared/components/core/title-desktop/title-desktop.component';
import { WalletHistoryComponent } from './pages/app/wallet/wallet-details/wallet-history/wallet-history.component';
import { WalletHistoryCardComponent } from './shared/components/app/wallet/wallet-history/wallet-history.component';
import { AddWalletComponent } from './shared/components/shared/modal/add-wallet/add-wallet.component';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './pages/app/settings/settings.component';
import { DeleteWalletComponent } from './shared/components/app/modal/delete-wallet/delete-wallet.component';
import { SocialListComponent } from './shared/components/app/modal/social/social-list/social-list.component';
import { SocialDetailsComponent } from './shared/components/app/modal/social/social-details/social-details.component';
import { VersionComponent } from './shared/components/app/modal/version-and-change/version/version.component';
import { ChangelogComponent } from './shared/components/app/modal/version-and-change/changelog/changelog.component';
import { ProfileSettingsComponent } from './shared/components/app/modal/profile-settings/profile-settings.component';
import { LanguagesComponent } from './shared/components/app/modal/languages/languages.component';
import { StatsComponent } from './pages/app/stats/stats.component';
import { DataComponent } from './pages/app/stats/data/data.component';
import { CategoryComponent } from './pages/app/stats/category/category.component';
import { HistoryComponent } from './pages/app/stats/history/history.component';
import { NgChartsModule } from 'ng2-charts';
import { AddStatsComponent } from './pages/app/stats/add-stats/add-stats.component';
import { CategoryModalComponent } from './shared/components/app/modal/category/category.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { AuthComponent } from './auth/auth.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReportBugComponent } from './shared/components/app/modal/report-bug/report-bug.component';
import { OnboardingComponent } from './interceptors/onboarding/onboarding.component';
import { LoadingComponent } from './interceptors/loading/loading.component';
import { LoaderInterceptor } from 'src/assets/core/interceptors/loader.interceptor';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfoAppComponent } from './shared/components/app/modal/info-app/info-app.component';
import { UpdateComponent } from './shared/components/app/modal/update/update.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { OpenBugComponent } from './shared/components/app/modal/open-bug/open-bug.component';
import { SupportComponent } from './pages/app/support/support.component';
import { BackupDataComponent } from './shared/components/app/modal/backup-data/backup-data.component';
import { CryptoDashboardComponent } from './pages/crypto/crypto-dashboard/crypto-dashboard.component';
import { CryptoComponent } from './pages/crypto/crypto.component';
import { RequirementsComponent } from './pages/crypto/requirements/requirements.component';
import { CryptoHeaderComponent } from './shared/components/core/crypto-header/crypto-header.component';
import { AddAssetModalComponent } from './shared/components/crypto/modal/add-asset-modal/add-asset-modal.component';
import { AppPagesComponent } from './pages/app/app.pages.component';

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
    WalletHistoryComponent,
    WalletHistoryCardComponent,
    AddWalletComponent,
    SettingsComponent,
    DeleteWalletComponent,
    SocialListComponent,
    SocialDetailsComponent,
    VersionComponent,
    ChangelogComponent,
    ProfileSettingsComponent,
    LanguagesComponent,
    StatsComponent,
    DataComponent,
    CategoryComponent,
    HistoryComponent,
    AddStatsComponent,
    CategoryModalComponent,
    LoginComponent,
    RegisterComponent,
    ForgotComponent,
    AuthComponent,
    AppPagesComponent,
    ReportBugComponent,
    OnboardingComponent,
    LoadingComponent,
    InfoAppComponent,
    UpdateComponent,
    ResetPasswordComponent,
    OpenBugComponent,
    SupportComponent,
    BackupDataComponent,
    CryptoDashboardComponent,
    CryptoComponent,
    RequirementsComponent,
    CryptoHeaderComponent,
    AddAssetModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    HttpClientModule,
    NgApexchartsModule,
    NgChartsModule,
    FormsModule,
    TranslateModule.forRoot({
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
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
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
