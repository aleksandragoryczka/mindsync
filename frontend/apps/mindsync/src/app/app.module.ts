import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { UiModule } from '@project/ui';
import { SharedModule } from '@project/shared';
import { LayoutModule } from '@project/layout';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment.development';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from './dashboard/dashboard.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    SharedModule,
    LayoutModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.allowedDomains],
        disallowedRoutes: [],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 3500,
      closeButton: true,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
