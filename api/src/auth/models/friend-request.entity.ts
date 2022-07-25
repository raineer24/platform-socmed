import { Column, OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
