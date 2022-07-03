import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
export declare class FeedController {
    private feedService;
    constructor(feedService: FeedService);
    create(post: FeedPost): Observable<FeedPost>;
    findAll(): Observable<FeedPost[]>;
    update(id: number, feedPost: FeedPost): Observable<UpdateResult>;
    delete(id: number): Observable<DeleteResult>;
}
