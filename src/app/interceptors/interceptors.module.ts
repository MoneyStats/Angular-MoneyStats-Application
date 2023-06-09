import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/components/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { LoadingComponent } from './loading/loading.component';
import { ErrorHandleComponent } from './error-handle/error-handle.component';
import { RouterModule } from '@angular/router';
import { InteceptorsRoutingModule } from './interceptors-routing.module';
import { AppComponentsModule } from '../shared/components/app/app-components.module';

@NgModule({
  declarations: [OnboardingComponent, LoadingComponent, ErrorHandleComponent],
  exports: [OnboardingComponent, LoadingComponent, ErrorHandleComponent],
  imports: [
    InteceptorsRoutingModule,
    RouterModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    AppComponentsModule,
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
export class InterceptorsModule {}
