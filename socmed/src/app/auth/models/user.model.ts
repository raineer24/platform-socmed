import { Post } from 'src/app/home/models/post.interface';

export type Role = 'admin' | 'premium' | 'user';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  // imagePath?: string;
  posts?: Post[];
}
