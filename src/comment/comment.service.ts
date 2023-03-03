import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    try {
      return await this.commentRepository.save(createCommentDto);
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
