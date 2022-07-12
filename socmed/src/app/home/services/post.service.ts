import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getSelectedPosts(params) {
    return this.http.get<Post[]>(`${environment.baseApiUrl}/feed${params}`);
  }
}
