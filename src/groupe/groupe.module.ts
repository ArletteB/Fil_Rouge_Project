import { Module } from '@nestjs/common';
import { GroupeService } from './groupe.service';
import { GroupeController } from './groupe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupeEntity } from './entities/groupe.entity';
import { PostEntity } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupeEntity, PostEntity])],
  controllers: [GroupeController],
  providers: [GroupeService, PostService],
})
export class GroupeModule {}
