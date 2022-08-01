import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import {
  FriendRequestStatus,
  FriendRequest_Status,
} from '../../models/FriendRequest';
import { BannerColorService } from '../../services/banner-color.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent implements OnInit, OnDestroy {
  user: User;
  friendRequestsStatus: FriendRequest_Status;
  friendRequestStatusSubscription$: Subscription;
  userSubscription$: Subscription;

  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    public connectionProfileService: ConnectionProfileService
  ) {}

  ngOnInit() {
    this.friendRequestStatusSubscription$ = this.getFriendRequestStatus()
      .pipe(
        tap((friendRequestStatus: FriendRequestStatus) => {
          this.friendRequestsStatus = friendRequestStatus.status;
          console.log('this.friendREs', this.friendRequestsStatus);
          this.userSubscription$ = this.getUser().subscribe((user: User) => {
            this.user = user;
            const imgPath = user.imagePath ?? 'blank-profile-picture.png';
            // eslint-disable-next-line @typescript-eslint/dot-notation
            this.user['fullImagePath'] =
              'http://localhost:3000/api/feed/image/' + imgPath;
          });
        })
      )
      .subscribe();
  }
  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) =>
        this.connectionProfileService.getConnectionUser(userId)
      )
    );
  }

  addUser(): Subscription {
    this.friendRequestsStatus = 'pending';
    console.log('statys ', this.friendRequestsStatus);

    return this.getUserIdFromUrl()
      .pipe(
        switchMap((userId: number) => {
          console.log(3, 'shit');
          return this.connectionProfileService.addConnectionUser(userId);
        })
      )
      .pipe(take(1))
      .subscribe();
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) =>
        this.connectionProfileService.getFriendRequestStatus(userId)
      )
    );
  }

  ngOnDestroy(): void {
    this.userSubscription$.unsubscribe();
    this.friendRequestStatusSubscription$.unsubscribe();
  }

  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => +urlSegment[0].path)
    );
  }
}
