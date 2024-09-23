//App-Router
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistrationComponent } from './registration/registration.component';
import { UsersComponent } from './users/users.component';
import { EquipmentModelComponent } from './equipment-model/equipment-model.component';
import { AreaComponent } from './area/area.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { VncClientComponent } from './vnc-client/vnc-client.component';

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
    path: 'registration',
    component: RegistrationComponent,
    title: 'Registration'
  },
  {
    path: 'area',
    component: AreaComponent,
    title: 'Area Management'
  },
  {
    path: 'equipment',
    component: EquipmentComponent,
    title: 'Equipment Management'
  },
  {
    path: 'equipment-model',
    component: EquipmentModelComponent,
    title: 'EquipmentModel'
  },
  {
    path: 'users',
    component: UsersComponent,
    title: 'Manage User'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile'
  },
  {
    path: 'vnc-client',
    component: VncClientComponent,
    title: 'Vnc Client Component'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes as appRoutes };
