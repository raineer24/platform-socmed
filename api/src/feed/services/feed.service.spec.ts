import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');

import { User } from '../../auth/models/user.class';

import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post.interface';
import { FeedPostEntity } from '../models/post.entity';

describe('FeedService', () => {
  let feedService: FeedService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user.firstName = 'Ian';

  const mockFeedPost: FeedPost = {
    body: 'body',
    createdAt: new Date(),
    author: mockRequest.user,
  };

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
    updatePost: jest.fn().mockImplementation(() => {
      return mockUpdateResult;
    }),
    deletePost: jest.fn().mockImplementation(() => {
      return mockDeleteResult;
    }),
  };
  const mockUserService = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,

        {
          provide: JwtGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();
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
