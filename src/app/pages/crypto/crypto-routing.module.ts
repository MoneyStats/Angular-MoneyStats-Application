import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CryptoComponent } from './crypto.component';
import { CryptoDashboardComponent } from './crypto-dashboard/crypto-dashboard.component';
import { RequirementsComponent } from './requirements/requirements.component';

const routes: Routes = [
  {
    path: '',
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CryptoRoutingModule {}
