import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getSelectedPosts(params) {
    return this.http.get<Post[]>('http://localhost:3000/api/feed' + params);
  }
}
