import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from 'libs/shared/src/lib/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    //canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        //TODO: not better - youtube film - ABOUT GUARDS - CanActivateChild Route Guard in Angular | Angular Routing | Angular 13+
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
