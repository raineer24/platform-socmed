import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: ['http://localhost:8100'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleDisconnect() {
    console.log('disconnected');
  }
  @WebSocketServer()
  server: Server;

  handleConnection() {
    console.log('connection made');
  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('newMessage', message);
  }
}
