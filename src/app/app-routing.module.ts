import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AuthenticationLayoutComponent } from '@app/layout/authentication-layout/authentication-layout.component';
import { ContentLayoutComponent } from '@app/layout/content-layout/content-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthenticationLayoutComponent,
    loadChildren: () =>
      import('@modules/authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
    data: { title: 'Not found' },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
