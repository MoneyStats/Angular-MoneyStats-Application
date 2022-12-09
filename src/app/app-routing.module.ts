import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorHandleComponent } from './interceptors/error-handle/error-handle.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransactionDetailsComponent } from './pages/transactions/transaction-details/transaction-details.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { WalletComponent } from './pages/wallet/wallet.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'transactions',
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
