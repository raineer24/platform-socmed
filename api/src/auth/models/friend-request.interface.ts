import { User } from './user.class';

export type FriendRequest_Status = 'declined' | 'pending' | 'accepted';

export interface FriendRequestsStatus {
  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: FriendRequest_Status;
}
