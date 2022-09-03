import * as request from 'supertest';
import { User } from 'src/auth/models/user.class';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  const authUrl = `http://localhost:3000/api/auth`;

  const mockUser: User = {
    firstName: 'eugene',
    lastName: 'sanchez',
    email: 'eugenesanchez14@gmail.com',
    password: 'password',
  };

  describe('/auth/register (POST)', () => {
    it('it should register a user and return the new user object', () => {
      return request(authUrl)
        .post('/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect((response: request.Response) => {
          const { id, firstName, lastName, password, email, imagePath, role } =
            response.body;

          expect(typeof id).toBe('number'),
            expect(firstName).toEqual(mockUser.firstName),
            expect(lastName).toEqual(mockUser.lastName),
            expect(email).toEqual(mockUser.email),
            expect(password).toBeUndefined();
          expect(imagePath).toBeNull();
          expect(role).toEqual('user');
        })
        .expect(HttpStatus.CREATED);
    });

    it('it should not register a new user if the passed email already exists', () => {
      return request(authUrl)
        .post('/register')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
