import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { buffer, switchMap, take } from 'rxjs/operators';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {
  userFullImagePath: string;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  private userImagePathSubscription: Subscription;
  constructor(private authService: AuthService, 
    private popoverController: PopoverController) {}

  ngOnInit() {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        console.log('fullname', this.fullName);
        this.fullName$.next(fullName);
      });
  }

  async onSignOut() {
    await this.popoverController.dismiss();
    this.authService.logout();
    location.reload();
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
  }
}
