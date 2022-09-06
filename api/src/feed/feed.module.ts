import { Module } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './models/post.entity';
import { FeedController } from './controllers/feed.controller';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FeedPostEntity])],
  providers: [FeedService, IsCreatorGuard],
  controllers: [FeedController],
})
export class FeedModule {}
