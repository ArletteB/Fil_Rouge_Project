import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { PostEntity } from './entities/post.entity';
import { GroupeEntity } from 'src/groupe/entities/groupe.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(GroupeEntity)
    private readonly groupeRepository: Repository<GroupeEntity>,
  ) {}

  async create(postCreateDto: PostCreateDto) {
    try {
      const post = this.postRepository.create(postCreateDto);
      const completeImageUrl = `${process.env.API_SUPABASE_POST_URL}/${postCreateDto.image}`;

      // Assign the complete image URL to the post's image property
      post.image = completeImageUrl;

      return await this.postRepository.save(post);
    } catch (error) {
      throw new Error('Error while creating post');
    }
  }

  findAll() {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.groupe', 'groupe')
      .orderBy('groupe.id', 'ASC')
      .addOrderBy('post.id', 'DESC')
      .getMany();
  }

  async findOneById(id: number) {
    return await this.postRepository.findOneBy({ id });
  }

  async update(id: number, updatePostDto: PostUpdateDto) {
    const post = await this.postRepository.findOneBy({ id });
    const updatedPost = { ...post, ...updatePostDto };
    await this.postRepository.save(updatedPost);
    return updatedPost;
  }

  async remove(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    await this.postRepository.softRemove(post);
    return post;
  }
}
