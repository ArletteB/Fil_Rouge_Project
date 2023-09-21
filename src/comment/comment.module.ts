import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { PostEntity } from '../post/entities/post.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { GroupeEntity } from '../groupe/entities/groupe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      PostEntity,
      UserEntity,
      GroupeEntity,
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, UserService],
})
export class CommentModule {}
