import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'libs/layout/src/lib/dashboard/dashboard.component';
import { authGuard } from 'libs/shared/src/lib/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    //canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
