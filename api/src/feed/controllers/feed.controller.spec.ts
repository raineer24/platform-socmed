import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
//const httpMocks = require('node-mocks-http');

//import { User } from '../../auth/models/user.class';

import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post.interface';
//import { FeedPostEntity } from '../models/post.entity';
import { FeedController } from './feed.controller';

describe('FeedController', () => {
  let feedService: FeedService;
  let feedController: FeedController;

  const mockFeedPost: FeedPost = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [FeedService],
    })
      .overrideProvider(FeedService)
      .useValue(mockFeedPost)
      .compile();

    feedService = moduleRef.get<FeedService>(FeedService);
    feedController = moduleRef.get<FeedController>(FeedController);
  });

  it('should be defined', () => {
    expect(feedController).toBeDefined();
  });
});
