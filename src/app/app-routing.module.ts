import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorHandleComponent } from './interceptors/error-handle/error-handle.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AddStatsComponent } from './pages/stats/add-stats/add-stats.component';
import { StatsComponent } from './pages/stats/stats.component';
import { TransactionDetailsComponent } from './pages/transactions/transaction-details/transaction-details.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { WalletDetailsComponent } from './pages/wallet/wallet-details/wallet-details.component';
import { WalletHistoryComponent } from './pages/wallet/wallet-details/wallet-history/wallet-history.component';
import { WalletComponent } from './pages/wallet/wallet.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth/register',
    redirectTo: 'auth/register',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent, // another child route component that the router renders
      },
    ],
  },
  {
    path: 'transaction',
    component: TransactionsComponent,
  },
  {
    path: 'transaction/details/:wallet',
    component: TransactionDetailsComponent,
  },
  {
    path: 'wallet',
    component: WalletComponent,
  },
  {
    path: 'wallet/details/:wallet',
    component: WalletDetailsComponent,
  },
  {
    path: 'wallet/details/:wallet/history',
    component: WalletHistoryComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'stats/insert',
    component: AddStatsComponent,
  },
  {
    path: 'error',
    component: ErrorHandleComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
