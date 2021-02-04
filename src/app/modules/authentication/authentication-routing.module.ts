import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from '@modules/authentication/login/login.component';
import { RegisterComponent } from '@modules/authentication/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuthenticationRoutingModule {
  static components = [LoginComponent, RegisterComponent];
}
