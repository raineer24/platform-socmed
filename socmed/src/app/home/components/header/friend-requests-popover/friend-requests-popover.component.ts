import { Component, OnInit } from '@angular/core';
import { FriendRequest } from 'src/app/home/models/FriendRequest';
import { ConnectionProfileService } from 'src/app/home/services/connection-profile.service';
import { take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {
  constructor(
    public connectionProfileService: ConnectionProfileService,
    private popoverController: PopoverController
  ) {}

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

  async respondToFriendRequest(
    id: number,
    statusResponse: 'accepted' | 'declined'
  ) {
    const handleFriendRequest: FriendRequest =
      this.connectionProfileService.friendRequests.find(
        (friendRequest) => friendRequest.id === id
      );

    const unhandledFriendRequests: FriendRequest[] =
      this.connectionProfileService.friendRequests.filter(
        (friendRequest) => friendRequest.id !== handleFriendRequest.id
      );

    this.connectionProfileService.friendRequests = unhandledFriendRequests;

    if (this.connectionProfileService?.friendRequests.length === 0) {
      await this.popoverController.dismiss();
    }

    return this.connectionProfileService
      .responseToFriendRequest(id, statusResponse)
      .pipe(take(1))
      .subscribe();
  }
}
