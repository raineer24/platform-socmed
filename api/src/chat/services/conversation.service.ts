import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ActiveConversationEntity } from '../models/active-conversation.entity';
import { ConversationEntity } from '../models/conversation.entity';
import { Conversation } from '../models/conversation.interface';
import { MessageEntity } from '../models/message.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(ActiveConversationEntity)
    private readonly activeConversationRepository: Repository<ActiveConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  getConversation(
    creatorId: number,
    friendId: number,
  ): Observable<Conversation | undefined> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .where('conversation.creatorId = :creatorId', { creatorId })
        .orWhere('user.id = :friendId', { friendId })
        .having('COUNt(*) > 1')
        .getOne(),
    );
  }
}
