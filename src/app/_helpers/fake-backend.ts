import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { User } from '../_models/user';
import { MapBox } from '../_models/mapBox';
import { Helper } from '../_models/helper';

function users(): User[] {
  // array in local storage for registered users
  return JSON.parse(localStorage.getItem('users')) || [];
}

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  // configure fake backend
  backend.connections.subscribe((connection: MockConnection) => {
    // wrap in timeout to simulate server api call
    setTimeout(() => {

      // authenticate
      if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
        // get parameters from post request
        const params = JSON.parse(connection.request.getBody());

        // find if any user matches login credentials
        const filteredUsers = users().filter(user => {
          return user.username === params.username && user.password === params.password;
        });

        if (filteredUsers.length) {
          // if login details are valid return 200 OK with user details and fake jwt token
          const user: User = filteredUsers[0];
          connection.mockRespond(new Response(new ResponseOptions({
            status: 200,
            body: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              street: user.street,
              cp: user.cp,
              city: user.city,
              club: user.club,
              password: user.password,
              mapBoxes: user.mapBoxes,
              helpers: user.helpers,
              lastLogin: ((user !== undefined) && (user.lastLogin !== undefined)) ? user.lastLogin : Date.now(),
              token: 'fake-jwt-token'
            }
          })));
        } else {
          if (users() === undefined || users().length === 0) {
            connection.mockError(new Error('Problème système, merci de créer un nouvel utilisateur'));
          } else {
            const user = users().find(u => {
              return params.username === u.username;
            });
            if ((user !== undefined) && (user.password === undefined)) {
              connection.mockError(new Error('Problème système, merci de créer un nouvel utilisateur avec un login différent'));
            } else {
              // else return 400 bad request
              connection.mockError(new Error('Login ou mort de passe incorrect'));
            }
          }
        }

        return;
      }

      // get users
      if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return users if valid, this security
        // is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users() })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // get user by id
      if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return user if valid, this security
        // is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in users array
          const urlParts = connection.request.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 1], 10);
          const matchedUsers = users().filter(user => user.id === id);
          const user = matchedUsers.length ? matchedUsers[0] : null;

          // respond 200 OK with user
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // update user by id
      if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Put) {
        // check for fake auth token in header and return user if valid, this security
        // is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in users array
          const urlParts = connection.request.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 1], 10);
          const user = JSON.parse(connection.request.getBody());
          const lUsers = users();

          const index = lUsers.findIndex(matchUser => user.id === id);
          lUsers[index] = user;

          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('users', JSON.stringify(lUsers));

          // respond 200 OK with user
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // update user by id
      if (connection.request.url.match(/\/api\/user\/password\/\d+$/) && connection.request.method === RequestMethod.Put) {
        // check for fake auth token in header and return user if valid, this security
        // is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in users array
          const urlParts = connection.request.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 1], 10);
          const password = connection.request.getBody();

          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          currentUser.password = password;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));

          const users = JSON.parse(localStorage.getItem('users'));
          const index = users.findIndex(user => user.id === id);
          users[index] = currentUser;
          localStorage.setItem('users', JSON.stringify(users));

          // respond 200 OK with user
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: currentUser })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // create user
      if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Post) {
        // get new user object from post body
        const newUser: User = JSON.parse(connection.request.getBody());

        const lUsers = users();

        // validation
        const duplicateUser = lUsers.filter(user => user.username === newUser.username).length;
        if (duplicateUser) {
          return connection.mockError(new Error('Le login "' + newUser.username + '" est déjà utilisé, veuillez en choisir un autre.'));
        }
        newUser.mapBoxes = new Array();
        newUser.helpers = new Array();
        // save new user
        newUser.id = lUsers.length + 1;
        lUsers.push(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('users', JSON.stringify(lUsers));

        // respond 200 OK
        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

        return;
      }

      // delete user
      if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Delete) {
        // check for fake auth token in header and return user if valid, this security is implemented
        // server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('users');

          // respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // pass through any requests not handled above
      const realHttp = new Http(realBackend, options);
      const requestOptions = new RequestOptions({
        method: connection.request.method,
        headers: connection.request.headers,
        body: connection.request.getBody(),
        url: connection.request.url,
        withCredentials: connection.request.withCredentials,
        responseType: connection.request.responseType
      });
      realHttp.request(connection.request.url, requestOptions)
        .subscribe((response: Response) => {
          connection.mockRespond(response);
        },
        (error: any) => {
          connection.mockError(error);
        });

    }, 500);

  });

  return new Http(backend, options);
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: fakeBackendFactory,
  deps: [MockBackend, BaseRequestOptions, XHRBackend]
};
