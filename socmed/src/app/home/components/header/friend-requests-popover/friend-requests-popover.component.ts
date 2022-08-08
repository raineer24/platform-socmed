import { Component, OnInit } from '@angular/core';
import { FriendRequest } from 'src/app/home/models/FriendRequest';
import { ConnectionProfileService } from 'src/app/home/services/connection-profile.service';
import { take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {
  constructor(public connectionProfileService: ConnectionProfileService) {}

  ngOnInit() {
    this.connectionProfileService.friendRequests.map(
      (friendRequest: FriendRequest) => {
        const creatorId = (friendRequest as any)?.creator?.id;
        console.log('creatorID', creatorId);
        if (friendRequest && creatorId) {
          this.connectionProfileService
            .getConnectionUser(creatorId)
            .pipe(
              take(1),
              tap((user: User) => {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                friendRequest['fullImagePath'] =
                  'http://localhost:3000/api/feed/image/' +
                  (user?.imagePath || 'blank-profile-picture.png');
              })
            )
            .subscribe();
        }
      }
    );
  }
}
