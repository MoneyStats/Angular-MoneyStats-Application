import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { ErrorHandleComponent } from './error-handle/error-handle.component';

const routes: Routes = [
  {
    path: 'on-boarding',
    component: OnboardingComponent,
  },
  {
    path: 'on-boarding/crypto',
    component: OnboardingComponent,
  },
  {
    path: 'error',
    component: ErrorHandleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteceptorsRoutingModule {}
