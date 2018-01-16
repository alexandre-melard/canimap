import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { HelpComponent } from './help/index';
import { CanimapComponent } from './map/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_services/auth-guard.service';
import { CheckEnv } from './_services/check-env.service';
import { CallbackComponent } from './_guards/callback.component';

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
        canActivate: [CheckEnv]
    },
    {
        path: 'callback',
        component: CallbackComponent,
        canActivate: [CheckEnv]
    },
    // otherwise redirect to home
    {
        path: '**',
        redirectTo: '/map'
    }
];

export const routing = RouterModule.forRoot(appRoutes);
