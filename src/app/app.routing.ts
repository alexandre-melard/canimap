import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { HelpComponent } from './help/index';
import { CanimapComponent } from './map/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: 'user', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
    { path: 'map', component: CanimapComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '/map' }
];

export const routing = RouterModule.forRoot(appRoutes);
