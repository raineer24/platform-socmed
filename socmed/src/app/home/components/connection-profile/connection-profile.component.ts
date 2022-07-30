import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BannerColorService } from '../../services/banner-color.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent implements OnInit {
  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUserIdFromUrl().subscribe((x) => console.log(33, x));
  }
  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => +UrlSegment[0].path)
    );
  }
}
