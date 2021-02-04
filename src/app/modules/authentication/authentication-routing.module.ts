import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from '@modules/authentication/login/login.component';
import { RegisterComponent } from '@modules/authentication/register/register.component';
import { LoginGuard } from '../../core/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoginGuard],
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [LoginGuard],
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuthenticationRoutingModule {
  static components = [LoginComponent, RegisterComponent];
}
