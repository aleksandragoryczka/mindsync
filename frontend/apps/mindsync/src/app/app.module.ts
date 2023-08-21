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
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PresentationDetailsComponent } from './presentation-details/presentation-details.component';
import { ShowsComponent } from './shows/shows.component';

export function tokenGetter() {
  return localStorage.getItem('Access-Token');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PresentationDetailsComponent,
    ShowsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    SharedModule,
    LayoutModule,
    MatIconModule,
    SlickCarouselModule,
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
