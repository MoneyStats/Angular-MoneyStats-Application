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
import { ContentBoxComponent } from './card/content-box/content-box.component';
import { DashboardWalletComponent } from './card/dashboard-wallet/dashboard-wallet.component';
import { StatsCardComponent } from './card/stats-card/stats-card.component';
import { AvailableSoonComponent } from './modal/available-soon/available-soon.component';
import { BackupDataComponent } from './modal/backup-data/backup-data.component';
import { CategoryModalComponent } from './modal/category/category.component';
import { DeleteWalletComponent } from './modal/delete-wallet/delete-wallet.component';
import { InfoAppComponent } from './modal/info-app/info-app.component';
import { LanguagesComponent } from './modal/languages/languages.component';
import { OpenBugComponent } from './modal/open-bug/open-bug.component';
import { ProfileSettingsComponent } from './modal/profile-settings/profile-settings.component';
import { ReportBugComponent } from './modal/report-bug/report-bug.component';
import { UpdateComponent } from './modal/update/update.component';
import { VersionComponent } from './modal/version-and-change/version/version.component';
import { ChangelogComponent } from './modal/version-and-change/changelog/changelog.component';
import { WalletCardComponent } from './wallet/wallet-card/wallet-card.component';
import { WalletHistoryCardComponent } from './wallet/wallet-history/wallet-history.component';
import { RegistrationTokenComponent } from './modal/registration-token/registration-token.component';

@NgModule({
  declarations: [
    ContentBoxComponent,
    DashboardWalletComponent,
    StatsCardComponent,
    AvailableSoonComponent,
    BackupDataComponent,
    CategoryModalComponent,
    DeleteWalletComponent,
    InfoAppComponent,
    LanguagesComponent,
    OpenBugComponent,
    ProfileSettingsComponent,
    ReportBugComponent,
    UpdateComponent,
    VersionComponent,
    ChangelogComponent,
    WalletCardComponent,
    WalletHistoryCardComponent,
    RegistrationTokenComponent,
  ],
  exports: [
    ContentBoxComponent,
    DashboardWalletComponent,
    StatsCardComponent,
    AvailableSoonComponent,
    BackupDataComponent,
    CategoryModalComponent,
    DeleteWalletComponent,
    InfoAppComponent,
    LanguagesComponent,
    OpenBugComponent,
    ProfileSettingsComponent,
    ReportBugComponent,
    UpdateComponent,
    VersionComponent,
    ChangelogComponent,
    WalletCardComponent,
    WalletHistoryCardComponent,
    RegistrationTokenComponent,
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
export class AppComponentsModule {}
