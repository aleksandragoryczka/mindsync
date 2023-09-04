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

@NgModule({
  declarations: [AppComponent, StartComponent, SlidesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    SharedModule,
    LayoutModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
