import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private userService: UserService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    try {
      const { content, postId, userId, groupId } = createCommentDto;

      const post = await this.postRepository.findOne({
        where: { id: postId },
      } as FindOneOptions<PostEntity>);
      const user = await this.userRepository.findOne({
        where: { id: userId },
      } as FindOneOptions<UserEntity>);

      if (!post || !user) {
        throw new Error('Post or user not found');
      }

      // Vérifier si l'utilisateur fait partie du groupe
      const isInGroup = await this.userService.isUserInGroup(userId, groupId);
      if (!isInGroup) {
        throw new Error('User is not a member of the group');
      }

      const comment = this.commentRepository.create({
        content,
        post,
        author: user,
      });

      return await this.commentRepository.save(comment);
    } catch (error) {
      throw new Error('Error comment not created');
    }
  }

  findAll() {
    return this.commentRepository.createQueryBuilder('comment').getMany();
  }

  async findOneById(id: number) {
    return await this.commentRepository.findOneBy({ id });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOneBy({ id });
    const updatedComment = { ...comment, ...updateCommentDto };
    await this.commentRepository.save(updatedComment);
    return updatedComment;
  }

  async remove(id: number) {
    const comment = await this.findOneById(id);
    await this.commentRepository.remove(comment);
    return comment;
  }
}
