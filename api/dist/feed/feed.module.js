"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedModule = void 0;
const common_1 = require("@nestjs/common");
const feed_service_1 = require("./services/feed.service");
const typeorm_1 = require("@nestjs/typeorm");
const post_entity_1 = require("./models/post.entity");
const feed_controller_1 = require("./controllers/feed.controller");
const is_creator_guard_1 = require("./guards/is-creator.guard");
const auth_module_1 = require("../auth/auth.module");
let FeedModule = class FeedModule {
};
FeedModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([post_entity_1.FeedPostEntity])],
        providers: [feed_service_1.FeedService, is_creator_guard_1.IsCreatorGuard],
        controllers: [feed_controller_1.FeedController],
    })
], FeedModule);
exports.FeedModule = FeedModule;
//# sourceMappingURL=feed.module.js.map