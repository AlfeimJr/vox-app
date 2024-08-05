import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterCompanyComponent } from './pages/register-company/register-company.component';
import { AuthGuard } from './@core/guards/auth.guard';
import { EditCompanyComponent } from './pages/register-company/edit-company/edit-company.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register-company',
    component: RegisterCompanyComponent,
    canActivate: [AuthGuard],
    data: { title: 'Lista de empresas' },
    children: [
      {
        path: 'form-stepper',
        component: RegisterCompanyComponent,
        data: { title: 'Cadastrar empresa' },
      },
      {
        path: 'edit-company/:id',
        component: EditCompanyComponent,
        data: { title: 'Editar empresa' },
      },
    ],
  },
];
