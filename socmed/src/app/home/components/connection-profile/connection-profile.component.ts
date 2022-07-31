import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { FriendRequestStatus } from '../../models/FriendRequest';
import { BannerColorService } from '../../services/banner-color.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent implements OnInit {
  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    public connectionProfileService: ConnectionProfileService
  ) {}

  ngOnInit() {}
  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) =>
        this.connectionProfileService.getConnectionUser(userId)
      )
    );
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) =>
        this.connectionProfileService.getFriendRequestStatus(userId)
      )
    );
  }

  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => +urlSegment[0].path)
    );
  }
}
