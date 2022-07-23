import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../guards/jwt.guard';
import { UserService } from '../services/user.service';
import {
  // isFileExtensionSafe,
  saveImageToStorage,
  removeFile,
  isFileExtensionSafe,
} from '../helpers/image-storage';
import { map, Observable, of, switchMap } from 'rxjs';
import { join } from 'path';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): any {
    const fileName = file?.filename;

    if (!fileName) {
      return of({ error: 'File must be a png, jpg/jpeg' });
    }

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;
          return this.userService.updateUserImageById(userId, fileName);
        }
        return of({ error: 'File content does not match extension!' });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Request() req, @Res() res): Observable<object> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image-name')
  findUserImageName(@Request() req, @Res() res): Observable<object> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of({ imageName });
      }),
    );
  }
}
