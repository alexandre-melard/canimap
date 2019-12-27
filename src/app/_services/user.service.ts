import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LogService} from './log.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/Observable/of';
import {catchError, share, tap} from 'rxjs/operators';
import {User} from '../_models';

@Injectable()
export class UserService {
    private _user;

    constructor(
        private http: HttpClient,
        private log: LogService
    ) {
    }

    private static get httpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            })
        };
    }

    create(user: User) {
        this.log.debug('[UserService] create');
        return this.http
            .post<User>(environment.backend + '/api/users', user, UserService.httpOptions)
            .pipe(
                tap((userResult: User) => this.log.debug(`[UserService] added user w/ id=${userResult._id}`)),
                catchError(this.handleError('create'))
            );
    }

    update(user: User) {
        this.log.debug('[UserService] update');
        return this.http
            .put<User>(environment.backend + '/api/users/' + user.email, user, UserService.httpOptions)
            .pipe(
                tap((userResult: User) => {
                    this.log.debug(`[UserService] updated user w/ id=${userResult._id}`);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    return user;
                }),
                catchError(this.handleError('update'))
            );
    }

    get(email: string) {
        this.log.debug('[UserService] get');
        return this.http
            .get<User>(environment.backend + '/api/users/' + email, UserService.httpOptions);
    }

    currentUser(): Observable<User> {
        this.log.debug('[UserService] currentUser');
        if (!this._user) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                this.log.debug(`[UserService] currentUser: found current user in localStorage with email: ${currentUser.email}`);
                this.log.setUser(currentUser);
                this._user = new Observable<User>((observer) => {
                    observer.next(currentUser);
                });
            } else {
                this._user = this.get(localStorage.getItem('email'));
                this._user = this._user.pipe(share());
                this._user.subscribe(user => {
                    this.log.setUser(user);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                });
            }
        }
        return this._user;
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            this.log.error(`[UserService] ${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}

