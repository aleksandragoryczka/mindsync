import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LayoutModule } from '@project/layout';
import { SharedModule } from '@project/shared';
import { UiModule } from '@project/ui';
import { StartComponent } from './start/start.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SlidesComponent } from './slides/slides.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';
import { sharedEnvironment } from 'libs/shared/src/lib/environments/shared-environment';

export function tokenGetter() {
  return localStorage.getItem('Access-Token');
}

@NgModule({
  declarations: [AppComponent, StartComponent, SlidesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    SharedModule,
    LayoutModule,
    MatProgressSpinnerModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3500,
      closeButton: true,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [sharedEnvironment.allowedDomains],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
