import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChatSocketService } from 'src/app/core/chat-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('form') form: NgForm;
  newMessage$: Observable<string>;
  messages: string[] = [];

  userFullImagePath: string;
  
  private userIdSubscription: Subscription;

  friends: User[] = [];
  friend: User;
  friend$: BehaviorSubject<User> = new BehaviorSubject<User>({});
  
  private userImagePathSubscription: Subscription;
  private messagesSubscription: Subscription;
  private conversationSubscription: Subscription;
  private friendsSubscription: Subscription;
  private friendSubscription: Subscription;
  
  selectedConversationIndex: number = 0;

  constructor(private chatService: ChatService, 
    private authService: AuthService,
    private chatSocketService: ChatSocketService) {}

  ionViewDidEnter() {
    console.log("did enter");
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullimagePath: string) => {
      this.userFullImagePath = fullimagePath;
    })
    this.messagesSubscription = this.chatService.getNewMessage().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.friendsSubscription = this.chatService.getFriends().subscribe((friends: User[]) => {
      console.log(2, friends);
      this.friends = friends;
    })
  }

  onSubmit() {
    const { message } = this.form.value;
    if (!message) {
      return;
    }
    this.chatService.sendMessage(message);
    this.form.reset();
  }

  openConversation(friend: User, index: number): void {
    this.selectedConversationIndex = index;
  }

  ionViewDidLeave() {
    console.log("did leave");
    this.userImagePathSubscription.unsubscribe();
    this.messagesSubscription.unsubscribe();
    this.friendsSubscription.unsubscribe();
  }
}
