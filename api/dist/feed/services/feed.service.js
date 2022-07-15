"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rxjs_1 = require("rxjs");
const post_entity_1 = require("../models/post.entity");
let FeedService = class FeedService {
    constructor(feedPostRepository) {
        this.feedPostRepository = feedPostRepository;
    }
    createPost(user, feedPost) {
        feedPost.author = user;
        return (0, rxjs_1.from)(this.feedPostRepository.save(feedPost));
    }
    findAllPosts() {
        return (0, rxjs_1.from)(this.feedPostRepository.find());
    }
    findPosts(take = 10, skip = 0) {
        return (0, rxjs_1.from)(this.feedPostRepository.findAndCount({ take, skip }).then(([posts]) => {
            return posts;
        }));
    }
    updatePost(id, feedPost) {
        return (0, rxjs_1.from)(this.feedPostRepository.update(id, feedPost));
    }
    deletePost(id) {
        return (0, rxjs_1.from)(this.feedPostRepository.delete(id));
    }
    findPostById(id) {
        return (0, rxjs_1.from)(this.feedPostRepository.findOne({
            relations: ['author'],
            where: {
                id,
            },
        }));
    }
};
FeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.FeedPostEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FeedService);
exports.FeedService = FeedService;
//# sourceMappingURL=feed.service.js.map