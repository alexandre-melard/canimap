import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../home';
import {HelpComponent} from '../help';
import {CanimapComponent} from '../map';
import {RegisterComponent} from '../register';
import {AuthGuard} from '../_services/auth-guard.service';
import {CheckEnv} from '../_services/check-env.service';
import {LoginComponent} from '../_guards/login.component';

const appRoutes: Routes = [
    {
        path: 'user',
        component: HomeComponent,
        canActivate: [CheckEnv, AuthGuard]
    },
    {
        path: 'help',
        component: HelpComponent,
        canActivate: [CheckEnv]
    },
    {
        path: 'map',
        component: CanimapComponent,
        canActivate: [CheckEnv, AuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [CheckEnv, AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [CheckEnv]
    },
    // otherwise redirect to home
    {
        path: '**',
        redirectTo: '/map'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})

export class AppRoutingModule {
}
