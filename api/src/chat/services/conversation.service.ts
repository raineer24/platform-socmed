import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveConversationEntity } from '../models/active-conversation.entity';
import { ConversationEntity } from '../models/conversation.entity';
import { MessageEntity } from '../models/message.entity';

@Injectable()
export class ConversationService {
    constructor() {
        @InjectRepository(ConversationEntity)
        private readonly conversationRepository: Repository<ConversationEntity>,
        @InjectRepository(ActiveConversationEntity)
        private readonly activeConversationRepository: Repository<ActiveConversationEntity>,
        @InjectRepository(MessageEntity),
        private readonly messageRE
        
    }
}
