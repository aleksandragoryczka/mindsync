import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [NavigationComponent, RouterModule],
  declarations: [NavigationComponent],
})
export class LayoutModule {}
