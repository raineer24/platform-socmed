import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment';
import { ChatSocketService } from 'src/app/core/chat-socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private http: HttpClient,  
    private socket: ChatSocketService) {}

  sendMessage(message: string): void {
    this.socket.emit('sendMessage', message);
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseApiUrl}/user/friends/my`);
  }
}
