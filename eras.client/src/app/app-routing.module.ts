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
import { AreaAsignComponent } from './area-asign/area-asign.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { VncClientComponent } from './vnc-client/vnc-client.component';
import { RoleGuard } from './services/guards/role-guard.service';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Engineer', 'Viewer'] },
  },

  {
    path: 'registration',
    component: RegistrationComponent,
    title: 'Registration',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'area',
    component: AreaComponent,
    title: 'Area Management',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'area-asign',
    component: AreaAsignComponent,
    title: 'Area Asignment',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Engineer'] },
  },
  {
    path: 'equipment',
    component: EquipmentComponent,
    title: 'Equipment Management',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Engineer'] },
  },
  {
    path: 'equipment-model',
    component: EquipmentModelComponent,
    title: 'EquipmentModel',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'users',
    component: UsersComponent,
    title: 'Manage User',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Engineer', 'Viewer'] },
  },
  {
    path: 'vnc-client',
    component: VncClientComponent,
    title: 'Vnc Client Component',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Engineer', 'Viewer'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes as appRoutes };
