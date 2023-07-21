import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './entities/like.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { GroupeEntity } from 'src/groupe/entities/groupe.entity';

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
