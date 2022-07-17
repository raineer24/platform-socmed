import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
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

  constructor(private postsService: PostService) {}

  ngOnInit() {
    this.getPosts(false, '');
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes.postBody.currentValue;
    if (!postBody) {
      return;
    }
    this.postsService.createPost(postBody).subscribe((post: Post) => {
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
