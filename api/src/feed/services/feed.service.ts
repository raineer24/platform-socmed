import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Observable, from, map } from 'rxjs';

import { FeedPostEntity } from '../models/post.entity';
import { FeedPost } from '../models/post.interface';
import { User } from 'src/auth/models/user.class';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
  ) {}

  createPost(user: User, feedPost: FeedPost): Observable<FeedPost> {
    feedPost.author = user;
    return from(this.feedPostRepository.save(feedPost));
  }

  findAllPosts(): Observable<FeedPost[]> {
    return from(this.feedPostRepository.find());
  }
  // findPosts(take = 10, skip = 0): Observable<FeedPost[]> {
  //   return from(
  //     this.feedPostRepository.findAndCount({ take, skip }).then(([posts]) => {
  //       return <FeedPost[]>posts;
  //     }),
  //   );
  // }

  findPosts(take = 10, skip = 0): Observable<FeedPost[]> {
    return from(
      this.feedPostRepository
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.author', 'author')
        .orderBy('post.createdAt', 'DESC')
        .take(take)
        .skip(skip)
        .getMany(),
    );
  }

  updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
    return from(this.feedPostRepository.update(id, feedPost));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedPostRepository.delete(id));
  }
  findPostById(id: number): Observable<FeedPost> {
    return from(
      this.feedPostRepository.findOne({
        relations: ['author'],
        where: {
          id,
        },
      }),
    );
  }
}
