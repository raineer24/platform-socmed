/* eslint-disable @angular-eslint/use-lifecycle-interface */
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Post } from '../../models/post.interface';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() postBody: string;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  userId$ = new BehaviorSubject<number>(null);

  constructor(
    private postsService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getPosts(false, '');

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes.postBody.currentValue;

    if (!postBody) {
      return;
    }
    this.postsService.createPost(postBody).subscribe((post: Post) => {
      console.log('postSERVICES');
      this.allLoadedPosts.unshift(post);
    });
  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postsService.getSelectedPosts(this.queryParams).subscribe(
      (posts: Post[]) => {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let post = 0; post < posts.length; post++) {
          this.allLoadedPosts.push(posts[post]);
        }
        if (isInitialLoad) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          event.target.complete();
        }
        this.skipPosts = this.skipPosts + 5;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadData(event) {
    this.getPosts(true, event);
  }
}
