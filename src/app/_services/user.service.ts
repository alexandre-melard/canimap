import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';

import { User } from '../_models/index';

@Injectable()
export class UserService {
  private _user;
  private promise;

  constructor(private http: Http, private authHttp: AuthHttp) { }

  create(user: User) {
    return this.authHttp.post(environment.backend + '/api/users', user)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  update(user: User) {
    return this.authHttp.put(environment.backend + '/api/users/' + user.email, user)
      .toPromise()
      .then(() => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      })
      .catch(this.handleError);
  }

  modifyPassword(email: any, password: string) {
    return this.http.put(environment.backend + '/api/user/password/' + email, password)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  delete(email: string) {
    return this.authHttp.delete(environment.backend + '/api/users/' + email)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  get(email: string) {
    return this.authHttp.get(environment.backend + '/api/users/' + email)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  currentUser(): Promise<User> {
    if (this.promise === undefined) {
      this.promise = new Promise<User>((resolve, reject) => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser === undefined || currentUser === null) {
          currentUser = this.get(localStorage.getItem('email'))
            .then(result => {
              localStorage.setItem('currentUser', JSON.stringify(result));
              resolve(result);
            })
            .catch((error) => reject('error while retrieving user with error: ' + JSON.stringify(error)));
        } else {
          resolve(currentUser);
        }
      });
    }
    return this.promise;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
