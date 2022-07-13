import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { User } from 'src/auth/models/user.class';
import { AuthService } from 'src/auth/services/auth.service';
import { FeedService } from '../services/feed.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
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
  }
}
