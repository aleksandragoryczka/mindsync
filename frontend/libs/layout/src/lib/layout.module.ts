import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, RouterModule, MatButtonModule, MatMenuModule],
  exports: [NavigationComponent, RouterModule],
  declarations: [NavigationComponent],
})
export class LayoutModule {}
