//App-Router
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistrationComponent } from './registration/registration.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile'
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    title: 'Registration'
  },
  {
    path: 'users',
    component: UsersComponent,
    title: 'Manage User'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes as appRoutes };
