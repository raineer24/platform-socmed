import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { take } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/auth/models/user.class';
import { AuthService } from 'src/auth/services/auth.service';
import { ConversationService } from '../services/conversation.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:8100'] } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private authService: AuthService,
    private conversationService: ConversationService,
  ) {}

  // Note: Runs when server starts - Remove in production
  onModuleInit() {
    this.conversationService
      .removeActiveConversations()
      .pipe(take(1))
      .subscribe();
    this.conversationService.removeMessages().pipe(take(1)).subscribe();
    this.conversationService.removeConversations().pipe(take(1)).subscribe();
  }
  @WebSocketServer()
  server: Server;

  @UseGuards(JwtGuard)
  handleConnection() {
    console.log('HANDLE CONNECTION');
  }


  handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECT');
    const jwt = socket.handshake.headers.authorization || null;
    this.authService.getJwtUser(jwt).subscribe((user: User) => {
      if (!user) {
        console.log('NO USER');
        this.handleDisconnect(socket);
      } else {
        socket.data.user = user;
        this.getConversations(socket, user.id);
      }
    });
  }

  getConversations(socket: Socket, userId: number) {
    return this.conversationService
      .getConversationsWithUsers(userId)
      .subscribe((conversations) => {
        this.server.to(socket.id).emit('conversations', conversations);
      });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('newMessage', message);
  }
}
