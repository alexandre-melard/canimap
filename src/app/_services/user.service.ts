import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogService } from '../_services/log.service';

import { environment } from '../../environments/environment';
import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../_models/index';

@Injectable()
export class UserService {
  private _user;

  constructor(
    private http: HttpClient,
    private log: LogService
  ) { }

  private get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('id_token')
      })
    };
  }

  create(user: User) {
    return this.http
      .post<User>(environment.backend + '/api/users', user, this.httpOptions)
      .pipe(
        tap((userResult: User) => this.log.debug(`added user w/ id=${userResult._id}`)),
        catchError(this.handleError('create'))
      );
  }

  update(user: User) {
    return this.http
      .put<User>(environment.backend + '/api/users/' + user.email, user, this.httpOptions)
      .pipe(
        tap((userResult: User) => {
          this.log.debug(`updated user w/ id=${userResult._id}`);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }),
        catchError(this.handleError('update'))
      );
  }

  get(email: string) {
    return this.http
      .get<User>(environment.backend + '/api/users/' + email, this.httpOptions)
      .pipe(
        tap((userResult: User) => {
          if (userResult) {
            this.log.debug(`get user w/ id=${userResult._id}`);
          } else {
            this.log.debug(`unknown user with email ${email}`);
            throw new ErrorEvent(`unknown user with email ${email}`);
          }
          return userResult;
        }),
        catchError(this.handleError('get'))
      );
  }

  currentUser(): Observable<User> {
    if (!this._user) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        this._user = new Observable<User>((observer) => {
          observer.next(currentUser);
        });
      } else {
        this._user = this.get(localStorage.getItem('email'));
        this._user.subscribe(user => {
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

      this.log.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

