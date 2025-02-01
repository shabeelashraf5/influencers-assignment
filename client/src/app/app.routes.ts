import { Routes } from '@angular/router';
import { LoginComponent } from './features/admin/login/login.component';
import { authLoginGuard } from './core/guards/auth-login.guard';
import { authLogoutGuard } from './core/guards/auth-logout.guard';

export const routes: Routes = [

    {path: '', redirectTo: 'admin-login', pathMatch: 'full'},
    {path:'admin-login', loadComponent: () => import('./features/admin/login/login.component').then(m => m.LoginComponent), canActivate: [authLogoutGuard] },
    {path: 'register', loadComponent: () => import('./features/admin/register/register.component').then(m => m.RegisterComponent), canActivate: [authLogoutGuard]},
    {path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authLoginGuard]},
    {path: 'leaderboard', loadComponent: () => import('./features/admin/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)},
    {path: 'page/:id', loadComponent: () => import('./features/admin/influencer-page/influencer-page.component').then(m => m.InfluencerPageComponent)}
];
