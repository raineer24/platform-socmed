import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { Role } from 'src/app/auth/models/user.model';
import { FormControl, FormGroup } from '@angular/forms';
type BannerColors = {
  colorOne: string;
  colorTwo: string;
  colorThree: string;
};
@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit {
  form: FormGroup;

  bannerColors: BannerColors = {
    colorOne: '#a0b4b7',
    colorTwo: '#dbe7e9',
    colorThree: '#bfd3d6;',
  };
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null),
    });

    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColors = this.getBannerColors(role);
    });
  }

  private getBannerColors(role: Role): BannerColors {
    switch (role) {
      case 'admin':
        return {
          colorOne: '#daa520',
          colorTwo: '#f0e68c',
          colorThree: '#fafad2',
        };

      case 'premium':
        return {
          colorOne: '#bc8f8f',
          colorTwo: '#c09999',
          colorThree: '#ddadaf',
        };

      case 'user':
        return {
          colorOne: '#a0b4b7',
          colorTwo: '#dbe7e9',
          colorThree: '#bfd3d6',
        };

      default:
        return this.bannerColors;
    }
  }
}
