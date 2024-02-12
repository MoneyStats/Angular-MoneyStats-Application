import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPagesComponent } from './app.pages.component';
import { RouteGuardService } from 'src/app/auth/route-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import {
  fadeSlider,
  fader,
  slideUp,
} from 'src/app/shared/animations/route-animations';
import { TransactionDetailsComponent } from './transactions/transaction-details/transaction-details.component';
import { WalletComponent } from './wallet/wallet.component';
import { WalletDetailsComponent } from './wallet/wallet-details/wallet-details.component';
import { WalletHistoryComponent } from './wallet/wallet-details/wallet-history/wallet-history.component';
import { SettingsComponent } from './settings/settings.component';
import { StatsComponent } from './stats/stats.component';
import { AddStatsComponent } from './stats/add-stats/add-stats.component';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
  {
    path: '',
    component: AppPagesComponent,
    canActivate: [RouteGuardService],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'transaction',
        component: TransactionsComponent,
        data: { animation: fadeSlider },
        //data: { animation: fader },
      },
      {
        path: 'transaction/details/:id/:wallet',
        component: TransactionDetailsComponent,
        data: { animation: fadeSlider },
        //data: { animation: slideUp },
      },
      {
        path: 'wallet',
        component: WalletComponent,
        //data: { animation: fader },
      },
      {
        path: 'wallet/details/:id/:wallet',
        component: WalletDetailsComponent,
        data: { animation: fadeSlider },
        //data: { animation: slideUp },
      },
      {
        path: 'wallet/details/:id/:wallet/history',
        component: WalletHistoryComponent,
        data: { animation: fadeSlider },
        //data: { animation: fader },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { animation: fadeSlider },
        //data: { animation: fader },
      },
      {
        path: 'stats',
        component: StatsComponent,
        data: { animation: fadeSlider },
        //data: { animation: fader },
      },
      {
        path: 'stats/insert',
        component: AddStatsComponent,
        data: { animation: fadeSlider },
        //data: { animation: fader },
      },
      {
        path: 'support',
        component: SupportComponent,
        data: { animation: fadeSlider },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPagesRoutingModule {}
