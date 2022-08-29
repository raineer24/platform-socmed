import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');

//import { User } from '../../auth/models/user.class';

import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post.interface';
//import { FeedPostEntity } from '../models/post.entity';
import { FeedController } from './feed.controller';
import { UserService } from '../../auth/services/user.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { User } from '../../auth/models/user.class';

describe('FeedController', () => {
  let feedService: FeedService;
  let feedController: FeedController;
  let userService: UserService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user.firstName = 'Ian';

  const mockFeedPost: FeedPost = {
    body: 'body',
    createdAt: new Date(),
    author: mockRequest.user,
  };

  const mockFeedPosts: FeedPost[] = [
    mockFeedPost,
    { ...mockFeedPost, body: 'second feed post' },
    { ...mockFeedPost, body: 'third feed post' },
  ];

  const mockFeedService = {
    createPost: jest
      .fn()
      .mockImplementation((user: User, feedPost: FeedPost) => {
        return {
          id: 1,
          ...feedPost,
        };
      }),
    findPosts: jest
      .fn()
      .mockImplementation((numberToTake: number, numberToSkip: number) => {
        const feedPostsAfterSkipping = mockFeedPosts.slice(numberToSkip);
        const filteredFeedPosts = feedPostsAfterSkipping.slice(0, numberToTake);
        return filteredFeedPosts;
      }),
  };
  const mockUserService = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        { provide: UserService, useValue: mockUserService },
        {
          provide: JwtGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: IsCreatorGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(FeedService)
      .useValue(mockFeedService)
      .compile();

    feedService = moduleRef.get<FeedService>(FeedService);
    userService = moduleRef.get<UserService>(UserService);
    feedController = moduleRef.get<FeedController>(FeedController);
  });

  it('should be defined', () => {
    expect(feedController).toBeDefined();
  });

  it('should create a feed post', () => {
    expect(feedController.create(mockFeedPost, mockRequest)).toEqual({
      id: expect.any(Number),
      ...mockFeedPost,
    });
  });

  it('should get 2 feed posts, skipping the first', () => {
    expect(feedController.findSelected(2, 1)).toEqual(mockFeedPosts.slice(1));
  });
});
