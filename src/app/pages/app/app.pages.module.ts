import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionDetailsComponent } from './transactions/transaction-details/transaction-details.component';
import { WalletComponent } from './wallet/wallet.component';
import { WalletDetailsComponent } from './wallet/wallet-details/wallet-details.component';
import { WalletHistoryComponent } from './wallet/wallet-details/wallet-history/wallet-history.component';
import { SettingsComponent } from './settings/settings.component';
import { StatsComponent } from './stats/stats.component';
import { AddStatsComponent } from './stats/add-stats/add-stats.component';
import { SupportComponent } from './support/support.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { InterceptorsModule } from 'src/app/interceptors/interceptors.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/shared/components/shared/shared.module';
import { CoreModule } from 'src/app/shared/components/core/core.module';
import { AppPagesComponent } from './app.pages.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HistoryComponent } from './stats/history/history.component';
import { CategoryComponent } from './stats/category/category.component';
import { DataComponent } from './stats/data/data.component';
import { AppPagesRoutingModule } from './app.pages-routing.module';
import { AppComponentsModule } from 'src/app/shared/components/app/app-components.module';

@NgModule({
  declarations: [
    DashboardComponent,
    TransactionsComponent,
    TransactionDetailsComponent,
    WalletComponent,
    WalletDetailsComponent,
    WalletHistoryComponent,
    SettingsComponent,
    StatsComponent,
    AddStatsComponent,
    SupportComponent,
    AppPagesComponent,
    HistoryComponent,
    CategoryComponent,
    DataComponent,
  ],
  imports: [
    AppPagesRoutingModule,
    SharedModule,
    AppComponentsModule,
    CoreModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    NgApexchartsModule,
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
export class AppPagesModule {}
