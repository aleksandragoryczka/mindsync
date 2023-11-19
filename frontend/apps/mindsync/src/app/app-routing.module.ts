import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from 'libs/shared/src/lib/guard/auth.guard';
import { NavigationComponent } from 'libs/layout/src/lib/navigation/navigation.component';
import { QuizDetailsComponent } from './quiz-details/quiz-details.component';
import { ShowsComponent } from './shows/shows.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { StartShowComponent } from './start-show/start-show.component';

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
      { path: 'profile', component: ProfileComponent },
      { path: 'admin-panel', component: AdminPanelComponent },
      {
        path: 'quiz/:id',
        component: QuizDetailsComponent,
      },
      {
        path: ':id/shows',
        component: ShowsComponent,
      },
      {
        path: ':id/start-show',
        component: StartShowComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
