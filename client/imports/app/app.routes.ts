import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EmailComponent } from './auth/email/email.component';

import { AdminComponent } from './web/admin/admin.component';
import { WebsiteComponent } from './web/website/website.component';

// import { HomeComponent } from './home/home.component';
// import { MaterialComponent } from './material/material.component';

import { AuthService } from './auth.service';
import { AuthService2 } from './auth2.service';

export const router: Routes = [
    // { path: '', redirectTo: 'admin', pathMatch: 'full' },
    { path: '', component: WebsiteComponent, pathMatch: 'full', canActivate: [AuthService2] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login-email', component: EmailComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthService] },
    // { path: 'website', component: WebsiteComponent },

    { path: ':id', component: WebsiteComponent },
    { path: ':id/:id2', component: WebsiteComponent }
    
    // { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    // { path: 'material', component: MaterialComponent }
]

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(router);