import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { buffer, switchMap, take } from 'rxjs/operators';
import { Role } from 'src/app/auth/models/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { fromBuffer } from 'file-type/core';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { FileTypeResult } from 'file-type';

// eslint-disable-next-line @typescript-eslint/naming-convention
type validFileExtension = 'png' | 'jpg' | 'jpeg';
// eslint-disable-next-line @typescript-eslint/naming-convention
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

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
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form: FormGroup;

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];
  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  // private userSubscription: Subscription;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  fullName$ = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  fullName = '';

  // eslint-disable-next-line @typescript-eslint/member-ordering
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

    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        console.log('fullname', this.fullName);
        this.fullName$.next(fullName);
      });

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        switchMap((buffer: Buffer) =>
          from(fromBuffer(buffer)).pipe(
            switchMap((fileTypeResult: FileTypeResult) => {
              if (!fileTypeResult) {
                //TODO: error handling
                console.log({ error: ' file format not supported' });
                return of();
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                //TODO: error handling!
                console.log({
                  error: 'file format does not match file extension',
                });
                return of();
              }
              return this.authService.uploadUserImage(formData);
            })
          )
        )
      )
      .subscribe();

    this.form.reset();
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
  }
}
