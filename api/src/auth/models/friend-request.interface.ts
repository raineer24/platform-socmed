import { User } from './user.class';

export type FriendRequest_Status =
  | 'not-sent'
  | 'declined'
  | 'pending'
  | 'accepted'
  | 'waiting-for-current-user-response';

export interface FriendRequestsStatus {
  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: FriendRequest_Status;
}
