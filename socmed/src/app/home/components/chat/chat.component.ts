import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;
  newMessage$: Observable<string>;
  messages: string[] = [];

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;
  private userIdSubscription: Subscription;

  friends: User[] = [];
  constructor(private chatService: ChatService, private authService: AuthService) {}

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullimagePath: string) => {
      this.userFullImagePath = fullimagePath;
    })
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.chatService.getFriends().subscribe((friends: User[]) => {
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

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
