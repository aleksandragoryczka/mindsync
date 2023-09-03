import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { LayoutModule } from '@project/layout';
import { SharedModule } from '@project/shared';
import { UiModule } from '@project/ui';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, UiModule, SharedModule, LayoutModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
