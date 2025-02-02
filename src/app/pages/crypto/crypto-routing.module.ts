import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CryptoComponent } from './crypto.component';
import { CryptoDashboardComponent } from './crypto-dashboard/crypto-dashboard.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { CryptoAssetComponent } from './crypto-asset/crypto-asset.component';
import { CryptoDetailsComponent } from './crypto-asset/crypto-details/crypto-details.component';
import { CryptoResumeComponent } from './crypto-resume/crypto-resume.component';
import { OperationExchangeComponent } from './operation-exchange/operation-exchange.component';
import { OperationsComponent } from './operations/operations.component';
import { fadeSlider } from 'src/app/shared/animations/route-animations';
import { MarketDataComponent } from './market-data/market-data.component';
import { RouteGuardService } from 'src/app/auth/route-guard.service';

const routes: Routes = [
  {
    path: '',
    component: CryptoComponent,
    children: [
      {
        path: 'dashboard',
        component: CryptoDashboardComponent,
        canActivate: [RouteGuardService],
      },
      {
        path: 'requirements',
        component: RequirementsComponent,
        canActivate: [RouteGuardService],
        data: { animation: fadeSlider },
      },
      {
        path: 'asset',
        component: CryptoAssetComponent,
        canActivate: [RouteGuardService],
        data: { animation: fadeSlider },
      },
      {
        path: 'asset/details/:identifier',
        component: CryptoDetailsComponent,
        canActivate: [RouteGuardService],
        //data: { animation: fadeSlider },
      },
      {
        path: 'resume',
        component: CryptoResumeComponent,
        canActivate: [RouteGuardService],
        data: { animation: fadeSlider },
      },
      {
        path: 'operation/:operationType/:wallet/:fiat',
        component: OperationExchangeComponent,
        canActivate: [RouteGuardService],
        data: { animation: fadeSlider },
      },
      {
        path: 'operations/:currency/:uuid',
        component: OperationsComponent,
        data: { animation: fadeSlider },
      },
      {
        path: 'market-data/:currency',
        component: MarketDataComponent,
        data: { animation: fadeSlider },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CryptoRoutingModule {}
