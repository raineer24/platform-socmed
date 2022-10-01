import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../models/post.interface';
import { environment } from 'src/environments/environment';
import { catchError, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorHandleService } from 'src/app/core/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
   
    private errorHandlerService: ErrorHandleService
  ) {
   
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private httpOptions: { headers: HttpHeaders } = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getSelectedPosts(params) {
    return this.http
      .get<Post[]>(`${environment.baseApiUrl}/feed${params}`)
      .pipe(
        tap((posts: Post[]) => {
          console.log('posts', posts);
          if (posts.length === 0) {
            throw new Error('No posts to retrieve');
          }
        }),
        catchError(
          this.errorHandlerService.handleError<Post[]>('getSelectedPosts', [])
        )
      );
  }

  createPost(body: string) {
    return this.http
      .post<Post>(`${environment.baseApiUrl}/feed`, { body }, this.httpOptions)
      .pipe(take(1));
  }

  updatePost(postId: number, body: string) {
    return this.http
      .put(
        `${environment.baseApiUrl}/feed/${postId}`,
        { body },
        this.httpOptions
      )
      .pipe(take(1));
  }

  deletePost(postId: number) {
    return this.http
      .delete(`${environment.baseApiUrl}/feed/${postId}`)
      .pipe(take(1));
  }
}
