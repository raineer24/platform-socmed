import { Module } from '@nestjs/common';
import { ChatGateway } from './gateaway/chat.gateway';

@Module({
  providers: [ChatGateway]
})
export class ChatModule {}
