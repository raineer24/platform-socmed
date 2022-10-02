import { UserEntity } from 'src/auth/models/user.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
