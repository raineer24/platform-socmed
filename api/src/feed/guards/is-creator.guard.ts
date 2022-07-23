import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/auth/models/user.class';
import { UserService } from 'src/auth/services/user.service';
import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post.interface';
@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private feedService: FeedService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: User; params: { id: number } } = request;

    if (!user || !params) {
      return false;
    }
    if (user.role === 'admin') {
      return true;
    }

    const userId = user.id;
    const feedId = params.id;

    // Determine if logged-in user is the same as the user that created the feed post
    return this.userService.findUserById(userId).pipe(
      switchMap((user: User) =>
        this.feedService.findPostById(feedId).pipe(
          map((feedPost: FeedPost) => {
            console.log('feedoist', feedPost.author.id);
            const isAuthor = user.id === feedPost.author.id;
            return isAuthor;
          }),
        ),
      ),
    );
  }
}
