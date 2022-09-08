import { NewUser } from '../models/newUser.model';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

let httpClientSpy: { post: jasmine.Spy };
let routerSpy: Partial<Router>;

let authService: AuthService;

const mockNewUser: NewUser = {
  firstName: 'Eugene',
  lastName: 'Sances',
  email: 'eugenesanchez5@gmail.com  ',
  password: 'password',
};

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HtttpClient', ['post']);
  routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  authService = new AuthService(httpClientSpy as any, routerSpy as any);
});

describe('AuthService', () => {
  describe('register', () => {
    it('should return the user', (done: DoneFn) => {
      const expectedUser: User = {
        id: 1,
        firstName: 'Eugene',
        lastName: 'Sances',
        email: 'eugenesanchez5@gmail.com  ',
        role: 'user',
        imagePath: null,
        posts: null,
      };

      httpClientSpy.post.and.returnValue(of(expectedUser));

      authService
        .register(mockNewUser)
        .suauth.service.spec.tsbscribe((user: User) => {});
    });
  });
});
import { NewUser } from '../models/newUser.model';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { of } from 'rxjs';

let httpClientSpy: { post: jasmine.Spy };
let routerSpy: Partial<Router>;

let authService: AuthService;

const mockNewUser: NewUser = {
  firstName: 'Eugene',
  lastName: 'Sances',
  email: 'eugenesanchez5@gmail.com  ',
  password: 'password',
};

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HtttpClient', ['post']);
  routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  authService = new AuthService(httpClientSpy as any, routerSpy as any);
});

describe('AuthService', () => {
  describe('register', () => {
    it('should return the user', (done: DoneFn) => {
      const expectedUser: User = {
        id: 1,
        firstName: 'Eugene',
        lastName: 'Sances',
        email: 'eugenesanchez5@gmail.com  ',
        role: 'user',
        imagePath: null,
        posts: null,
      };

      httpClientSpy.post.and.returnValue(of(expectedUser));

      authService.register(mockNewUser).subscribe((user: User) => {});
    });
  });
});
