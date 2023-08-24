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
import { MatIconModule } from '@angular/material/icon';
import { PresentationDetailsComponent } from './presentation-details/presentation-details.component';
import { ShowsComponent } from './shows/shows.component';
import { ScreenshotsComponent } from './shows/screenshots/screenshots.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from '../../../../libs/shared/src/lib/interceptor/loading.interceptor';

export function tokenGetter() {
  return localStorage.getItem('Access-Token');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PresentationDetailsComponent,
    ShowsComponent,
    ScreenshotsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    SharedModule,
    LayoutModule,
    MatIconModule,
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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
