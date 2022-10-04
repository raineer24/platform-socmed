import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthService } from 'src/auth/services/auth.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:8100'] } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private authService: AuthService) {}
  onModuleInit() {
    throw new Error('Method not implemented.');
  }
  handleDisconnect() {
    console.log('disconnected');
  }
  @WebSocketServer()
  server: Server;

  @UseGuards(JwtGuard)
  handleConnection() {
    console.log('connection made');
  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('newMessage', message);
  }
}
