import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorHandleComponent } from './interceptors/error-handle/error-handle.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/app/dashboard/dashboard.component';
import { AppPagesComponent } from './pages/app/app.pages.component';
import { SettingsComponent } from './pages/app/settings/settings.component';
import { AddStatsComponent } from './pages/app/stats/add-stats/add-stats.component';
import { StatsComponent } from './pages/app/stats/stats.component';
import { TransactionDetailsComponent } from './pages/app/transactions/transaction-details/transaction-details.component';
import { TransactionsComponent } from './pages/app/transactions/transactions.component';
import { WalletDetailsComponent } from './pages/app/wallet/wallet-details/wallet-details.component';
import { WalletHistoryComponent } from './pages/app/wallet/wallet-details/wallet-history/wallet-history.component';
import { WalletComponent } from './pages/app/wallet/wallet.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { RouteGuardService } from './auth/route-guard.service';
import { OnboardingComponent } from './interceptors/onboarding/onboarding.component';
import { fader, slideUp } from './shared/animations/route-animations';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SupportComponent } from './pages/app/support/support.component';
import { CryptoDashboardComponent } from './pages/crypto/crypto-dashboard/crypto-dashboard.component';
import { CryptoComponent } from './pages/crypto/crypto.component';
import { RequirementsComponent } from './pages/crypto/requirements/requirements.component';
const routes: Routes = [
  {
    path: 'error',
    component: ErrorHandleComponent,
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
    path: 'on-boarding',
    component: OnboardingComponent,
  },
  {
    path: 'crypto',
    component: CryptoComponent,
    children: [
      {
        path: 'dashboard',
        component: CryptoDashboardComponent,
      },
      {
        path: 'requirements',
        component: RequirementsComponent,
      },
    ],
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
      {
        path: 'forgot',
        component: ForgotComponent, // another child route component that the router renders
      },
      {
        path: 'resetPassword/token/:token',
        component: ResetPasswordComponent, // another child route component that the router renders
      },
    ],
  },
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
        data: { animation: fader },
      },
      {
        path: 'transaction/details/:id/:wallet',
        component: TransactionDetailsComponent,
        data: { animation: slideUp },
      },
      {
        path: 'wallet',
        component: WalletComponent,
        data: { animation: fader },
      },
      {
        path: 'wallet/details/:id/:wallet',
        component: WalletDetailsComponent,
        data: { animation: slideUp },
      },
      {
        path: 'wallet/details/:id/:wallet/history',
        component: WalletHistoryComponent,
        data: { animation: fader },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { animation: fader },
      },
      {
        path: 'stats',
        component: StatsComponent,
        data: { animation: fader },
      },
      {
        path: 'stats/insert',
        component: AddStatsComponent,
        data: { animation: fader },
      },
      {
        path: 'support',
        component: SupportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
