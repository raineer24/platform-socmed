import { UserEntity } from 'src/auth/models/user.entity';
export declare class FeedPostEntity {
    id: number;
    body: string;
    createdAt: Date;
    author: UserEntity;
}
