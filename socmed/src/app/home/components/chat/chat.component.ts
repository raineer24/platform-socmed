import { Component,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChatSocketService } from 'src/app/core/chat-socket.service';
import { Conversation } from '../../models/conversation';
import { Message } from '../../models/message';
import { throws } from 'assert';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('form') form: NgForm;
  newMessage$: Observable<string>;
  messages: Message[] = [];

  userFullImagePath: string;
  userId: number;

  conversations$: Observable<Conversation[]>;
  conversations: Conversation[] = [];
  conversation: Conversation;
  


  friends: User[] = [];
  friend: User;
  friend$: BehaviorSubject<User> = new BehaviorSubject<User>({});
  
  private userImagePathSubscription: Subscription;
  private userIdSubscription: Subscription;
  private messagesSubscription: Subscription;
  private conversationSubscription: Subscription;
  private newMessagesSubscription: Subscription;
  private friendsSubscription: Subscription;
  private friendSubscription: Subscription;
  
  selectedConversationIndex: number = 0;

  constructor(private chatService: ChatService, 
    private authService: AuthService,
   ) {}

  ionViewDidEnter() {
    console.log("did enter");
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullimagePath: string) => {
      this.userFullImagePath = fullimagePath;
    });

    this.userIdSubscription = this.authService.userId.subscribe((userId: number) => {
      this.userId = userId;
    });

    this.conversationSubscription = this.chatService
      .getConversations()
      .subscribe((conversations: Conversation[]) => {
        this.conversations.push(conversations[0]); // Note:// from mergeMap stream
      });

 
      this.messagesSubscription = this.chatService
      .getConversationMessages()
      .subscribe((messages: Message[]) => {
        messages.forEach((message: Message) => {
          const allMessageIds = this.messages.map(
            (message: Message) => message.id
          );
          if (!allMessageIds.includes(message.id)) {
            this.messages.push(message);
          }
        });
      });

      this.newMessagesSubscription = this.chatService
        .getNewMessage()
        .subscribe((message: Message) => {
          message.createdAt = new Date();

          const allMessageIds = this.messages.map(
            (message: Message) => message.id
          );

          if(!allMessageIds.includes(message.id)) {
            this.messages.push(message);
          }
        });

    this.friendsSubscription = this.chatService
        .getFriends()
        .subscribe((friends: User[]) => {
          this.friends = friends;

          if (friends.length > 0) {
            this.friend = this.friends[0];
            this.friend$.next(this.friend);

            friends.forEach((friend: User) => {
              this.chatService.createConversation(friend);
            });

            this.chatService.joinConversation(this.friend.id);

          }
        });
  }

  onSubmit() {
    const { message } = this.form.value;
    if (!message) {
      return;
    }
    this.chatService.sendMessage(message, this.conversation);
    this.form.reset();
  }

  openConversation(friend: User, index: number): void {
    this.selectedConversationIndex = index;
  }

  ionViewDidLeave() {
    this.chatService.leaveConversation();
    console.log("did leave");
    


    this.messagesSubscription.unsubscribe();
    this.userImagePathSubscription.unsubscribe();
    this.userIdSubscription.unsubscribe();
    this.conversationSubscription.unsubscribe();
    this.newMessagesSubscription.unsubscribe();
    this.friendsSubscription.unsubscribe();
    this.friendSubscription.unsubscribe();
  }
}
