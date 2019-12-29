import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../_models';

@Injectable()
export class LogService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;
    private user: User;

    constructor(
        private http: HttpClient,
        private router: Router) {
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

    private static get httpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            })
        };
    }

    public setUser(user: User) {
        this.user = user;
    }

    sendError(log: string, keepAfterNavigationChange = false) {
        this.log('error', log, keepAfterNavigationChange);
        let email: string;
        if (this.user && this.user.email) {
            email = this.user.email;
        } else {
            email = 'unknown';
        }
        return this.http
            .post<{ email: string, content: string }>(
                environment.backend + '/api/logs',
                {email: email, content: log},
                LogService.httpOptions);
    }

    log(type: string, message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({type: type, text: message});
        if (!keepAfterNavigationChange) {
            setTimeout(() => this.subject.next(), 4000);
        }
        console.log('[' + type + '] ' + message);
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
        // this.sendError(message, keepAfterNavigationChange).subscribe(() => this.success('error sent to server'));
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
