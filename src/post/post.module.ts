import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { GroupeEntity } from 'src/groupe/entities/groupe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, GroupeEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
