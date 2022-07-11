import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { from, Observable, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../models/user.class';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserEntity) 
    private readonly userRepository: Repository<UserEntity>) {
    }
  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  registerAccount(user: User): Observable<User> {
    const { firstName, lastName, email, password } = user;

    return this.hashPassword(password).pipe(
        switchMap(hashedPassword: string) => {
            return from(this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword
            }));
        }
    )
  }
}
