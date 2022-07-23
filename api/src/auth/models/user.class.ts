import { FeedPost } from 'src/feed/models/post.interface';
import { Role } from './role.enum';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  // @IsEmail()
  email?: string;
  // @IsString()
  password?: string;
  imagePath?: string;
  role?: Role;
  posts?: FeedPost[];
}
