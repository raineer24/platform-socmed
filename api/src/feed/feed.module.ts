import { Module } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './models/post.entity';
import { FeedController } from './controllers/feed.controller';
import { AuthService } from 'src/auth/services/auth.service';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Module({
  imports: [AuthService, TypeOrmModule.forFeature([FeedPostEntity])],
  providers: [FeedService, IsCreatorGuard],
  controllers: [FeedController],
})
export class FeedModule {}
