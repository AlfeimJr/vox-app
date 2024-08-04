import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterCompanyComponent } from './pages/register-company/register-company.component';
import { AuthGuard } from './@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register-company',
    component: RegisterCompanyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registe-company/form-stepper',
    component: RegisterCompanyComponent,
    canActivate: [AuthGuard],
  },
];
