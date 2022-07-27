import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequestEntity } from '../models/friend-request.entity';
import {
  FriendRequest,
  FriendRequestsStatus,
} from '../models/friend-request.interface';
import { User } from '../models/user.class';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}
  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({
        relations: ['feedPosts'],
        where: {
          id,
        },
      }),
    ).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      }),
    );
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  findImageNameByUserId(id: number): Observable<string> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        delete user.password;
        return user.imagePath;
      }),
    );
  }
  hasRequestBeenSentOrReceived(
    creator: User,
    receiver: User,
  ): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      }),
    ).pipe(
      switchMap((friendRequest: FriendRequest) => {
        if (!friendRequest) {
          return of(false);
        }
        return of(true);
      }),
    );
  }

  sendFriendRequest(
    receiverId: number,
    creator: User,
  ): Observable<FriendRequest | { error: string }> {
    if (receiverId === creator.id) {
      return of({ error: 'It is not possible to add yourself' });
    }

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: User) => {
        return this.hasRequestBeenSentOrReceived(creator, receiver).pipe(
          switchMap((hasRequestBeenSentOrReceived: boolean) => {
            if (hasRequestBeenSentOrReceived) {
              return of({
                error:
                  'A friend request has already been sent of received to your account!',
              });
            }
            // eslint-disable-next-line prefer-const
            let friendRequest: FriendRequest = {
              creator,
              receiver,
              status: 'pending',
            };
            return from(this.friendRequestRepository.save(friendRequest));
          }),
        );
      }),
    );
  }

  // getFriendRequestStatus(
  //   receiverId: number,
  //   currentUser: User,
  // ): Observable<FriendRequestsStatus> {
  //   return this.findUserById(receiverId).pipe(
  //     switchMap((receiver: User) => {
  //       return from(
  //         this.friendRequestRepository.findOne({
  //           creator: currentUser,
  //           receiver,
  //         }),
  //       );
  //     }),
  //     switchMap((friendRequest: FriendRequest) => {
  //       return of({ status: friendRequest.status });
  //     }),
  //   );
  // }

  getFriendRequestStatus(
    receiverId: number,
    currentUser: User,
  ): Observable<FriendRequestsStatus> {
    return this.findUserById(receiverId).pipe(
      switchMap((receiver: User) => {
        return from(
          this.friendRequestRepository.findOne({
            where: [{ creator: currentUser, receiver: receiver }],
          }),
        );
      }),
      switchMap((friendRequest: FriendRequest) => {
        return of({ status: friendRequest?.status });
      }),
    );
  }
}
