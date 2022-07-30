import { Component, OnInit } from '@angular/core';
import { BannerColorService } from '../../services/banner-color.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent implements OnInit {
  constructor(public bannerColorService: BannerColorService) {}

  ngOnInit() {}
}
