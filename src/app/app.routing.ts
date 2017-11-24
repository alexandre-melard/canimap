import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { HelpComponent } from './help/index';
import { CanimapComponent } from './map/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_services/auth-guard.service';
import { CallbackComponent } from './_guards/callback.component';

const appRoutes: Routes = [
    {
        path: 'user',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'help',
        component: HelpComponent
    },
    {
        path: 'map',
        component: CanimapComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'callback',
        component: CallbackComponent,
    },
    // otherwise redirect to home
    {
        path: '**',
        redirectTo: '/map'
    }
];

export const routing = RouterModule.forRoot(appRoutes);
