import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../guards/jwt.guard';
import { UserService } from '../services/user.service';
import {
  // isFileExtensionSafe,
  saveImageToStorage,
  // removeFile,
} from '../helpers/image-storage';
import { of } from 'rxjs';
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

    return of({ error: 'File content does not match extension!' });
  }
}
