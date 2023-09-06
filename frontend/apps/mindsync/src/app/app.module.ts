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
import { ProfileComponent } from './profile/profile.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ProfilePopupComponent } from './profile/profile-popup/profile-popup.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { StartShowComponent } from './start-show/start-show.component';
import { StartShowPopupComponent } from './start-show/start-show-popup/start-show-popup.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatisticsPopupComponent } from './start-show/statistics-popup/statistics-popup.component';
import { NgApexchartsModule } from 'ng-apexcharts';

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
    ProfileComponent,
    AdminPanelComponent,
    ProfilePopupComponent,
    StartShowComponent,
    StartShowPopupComponent,
    StatisticsPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    SharedModule,
    LayoutModule,
    MatIconModule,
    SlickCarouselModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgApexchartsModule,
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
