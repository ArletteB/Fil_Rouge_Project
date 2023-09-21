import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './entities/like.entity';
import { PostEntity } from '../post/entities/post.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { GroupeEntity } from '../groupe/entities/groupe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LikeEntity,
      PostEntity,
      UserEntity,
      GroupeEntity,
    ]),
  ],
  controllers: [LikeController],
  providers: [LikeService, UserService],
})
export class LikeModule {}
