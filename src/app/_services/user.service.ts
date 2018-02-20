import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../_models/index';

@Injectable()
export class UserService {
  private _user;

  constructor(private http: HttpClient) { }

  private get httpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token') })
    };
  }
  create(user: User) {
    return this.http
      .post<User>(environment.backend + '/api/users', user, this.httpOptions)
      .pipe(
        tap((userResult: User) => console.log(`added user w/ id=${userResult._id}`)),
        catchError(this.handleError('create'))
      );
  }

  update(user: User) {
    return this.http
    .put<User>(environment.backend + '/api/users/' + user.email, user, this.httpOptions)
    .pipe(
      tap((userResult: User) => {
        console.log(`updated user w/ id=${userResult._id}`);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }),
      catchError(this.handleError('update'))
    );
  }

  modifyPassword(email: any, password: string) {
    return this.http
    .put<User>(environment.backend + '/api/users/' + email, password, this.httpOptions)
    .pipe(
      tap((userResult: User) => {
        console.log(`updated user w/ id=${userResult._id}`);
        localStorage.setItem('currentUser', JSON.stringify(userResult));
        return userResult;
      }),
      catchError(this.handleError('password'))
    );
  }

  delete(email: string) {
    return this.http
    .delete<User>(environment.backend + '/api/users/' + email, this.httpOptions)
    .pipe(
      tap((userResult: User) => {
        console.log(`deleted user w/ id=${userResult._id}`);
        return userResult;
      }),
      catchError(this.handleError('delete'))
    );
  }

  get(email: string) {
    return this.http
    .get<User>(environment.backend + '/api/users/' + email, this.httpOptions)
    .pipe(
      tap((userResult: User) => {
        console.log(`get user w/ id=${userResult._id}`);
        return userResult;
      }),
      catchError(this.handleError('get'))
    );
  }

  currentUser(): Observable<User> {
    if (this._user === undefined) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser === undefined || currentUser === null) {
        this._user = this.get(localStorage.getItem('email'));
        this._user.subscribe(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
        });
      } else {
        this._user = new Observable<User>((observer) => {
          observer.next(currentUser);
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
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    console.error(error); // log to console instead

    console.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}}
