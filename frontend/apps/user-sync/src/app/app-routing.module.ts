import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlidesComponent } from './slides/slides.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  {
    path: ':id',
    component: SlidesComponent,
    data: { captureQueryParams: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
