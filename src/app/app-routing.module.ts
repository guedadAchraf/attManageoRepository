import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FormListComponent } from './features/forms/form-list/form-list.component';
import { FormCreateComponent } from './features/forms/form-create/form-create.component';
import { FormEditComponent } from './features/forms/form-edit/form-edit.component';
import { FormSubmitComponent } from './features/forms/form-submit/form-submit.component';
import { ExcelListComponent } from './features/excel/excel-list/excel-list.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'forms', component: FormListComponent, canActivate: [AuthGuard] },
  { path: 'forms/create', component: FormCreateComponent, canActivate: [AuthGuard] },
  { path: 'forms/:id/edit', component: FormEditComponent, canActivate: [AuthGuard] },
  { path: 'forms/:id/submit', component: FormSubmitComponent, canActivate: [AuthGuard] },
  { path: 'excel', component: ExcelListComponent, canActivate: [AuthGuard] },
  { path: 'admin/users', component: UserManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
