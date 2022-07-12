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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedPostEntity = void 0;
const user_entity_1 = require("../../auth/models/user.entity");
const typeorm_1 = require("typeorm");
let FeedPostEntity = class FeedPostEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FeedPostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], FeedPostEntity.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FeedPostEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (userEntity) => userEntity.feedPosts),
    __metadata("design:type", user_entity_1.UserEntity)
], FeedPostEntity.prototype, "author", void 0);
FeedPostEntity = __decorate([
    (0, typeorm_1.Entity)('feed_post')
], FeedPostEntity);
exports.FeedPostEntity = FeedPostEntity;
//# sourceMappingURL=post.entity.js.map