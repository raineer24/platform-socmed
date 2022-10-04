import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/auth/models/user.class';
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
    ).pipe(map((conversation: Conversation) => conversation || undefined));
  }

  createConversation(creator: User, friend: User): Observable<Conversation> {
    return this.getConversation(creator.id, friend.id).pipe(
      switchMap((conversation: Conversation) => {
        const doesConversationExist = !!conversation;
        if (!doesConversationExist) {
          const newConversation: Conversation = {
            users: [creator, friend],
          };
          return from(this.conversationRepository.save(newConversation));
        }
        return of(conversation);
      }),
    );
  }

  getConversationsForUser() {}

  getUsersInConversation() {}

  getConversationsWithUsers() {}

  joinConversation() {}


}
