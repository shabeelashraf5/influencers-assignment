import { Routes } from '@angular/router';
import { LoginComponent } from './features/admin/login/login.component';

export const routes: Routes = [

    {path: '', redirectTo: 'admin-login', pathMatch: 'full'},
    {path:'admin-login', loadComponent: () => import('./features/admin/login/login.component').then(m => m.LoginComponent) },
    {path: 'register', loadComponent: () => import('./features/admin/register/register.component').then(m => m.RegisterComponent)},
    {path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)}
];
