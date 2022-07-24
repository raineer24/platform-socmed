import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {
  userFullImagePath: string;
  private userImagePathSubscription: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  onSignOut() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
  }
}
