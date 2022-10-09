import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment';
import { ChatSocketService } from 'src/app/core/chat-socket.service';
import { Message } from '../models/message';
import { Conversation } from '../models/conversation';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private http: HttpClient,  
    private socket: ChatSocketService) {}

  sendMessage(message: string, conversation: Conversation): void {
    const newMessage: Message = {
      message,
      conversation
    }
    this.socket.emit('sendMessage', newMessage);
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseApiUrl}/user/friends/my`);
  }

  createConversation() {}

  joinConversation() {}

  leaveConversation() {}

  getConversationMessages() {}

  getConversations() {}
}
