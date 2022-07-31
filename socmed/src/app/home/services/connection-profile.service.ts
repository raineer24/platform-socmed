import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment';
import { FriendRequest, FriendRequestStatus } from '../models/FriendRequest';

@Injectable({
  providedIn: 'root',
})
export class ConnectionProfileService {
  constructor(private http: HttpClient) {}

  getConnectionUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.baseApiUrl}/user/${id}`);
  }

  getFriendRequestStatus(id: number) {
    return this.http.get<FriendRequestStatus>(
      `${environment.baseApiUrl}/user/friend-request/status/${id}`
    );
  }
}
