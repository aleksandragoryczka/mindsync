import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from 'libs/shared/src/lib/guard/auth.guard';
import { NavigationComponent } from 'libs/layout/src/lib/navigation/navigation.component';
import { PresentationDetailsComponent } from './presentation-details/presentation-details.component';

const routes: Routes = [
  { path: 'verify', component: NavigationComponent },
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'presentation/:id',
        component: PresentationDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
