import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable ,  Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class LogService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }
    log(type: string, message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: type, text: message });
        if (!keepAfterNavigationChange) {
            setTimeout(() => this.subject.next(), 4000);
        }
        console.log(type + ': ' + message);
    }

    debug(message: string, keepAfterNavigationChange = false) {
        if (!environment.production) {
            this.log('debug', message, keepAfterNavigationChange);
        }
    }

    info(message: string, keepAfterNavigationChange = false) {
        this.log('info', message, keepAfterNavigationChange);
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.log('success', message, keepAfterNavigationChange);
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.log('error', message, keepAfterNavigationChange);
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
