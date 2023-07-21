import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private userService: UserService, // private readonly postService: PostService,
  ) {}

  async create(createLikeDto: CreateLikeDto) {
    try {
      const { postId, userId } = createLikeDto;
      console.log('createLikeDto', createLikeDto);

      const post = await this.postRepository.findOne({
        where: { id: postId },
      } as FindOneOptions<PostEntity>);
      console.log('post', post);

      const user = await this.userRepository.findOne({
        where: { id: userId },
      } as FindOneOptions<UserEntity>);
      console.log('user', user);
      if (!post || !user) {
        throw new Error('Post or user not found');
      }
      // const isUserInGroup = await this.userService.isUserInGroup(
      //   userId,
      //   post.groupe.id,
      // );
      // if (!isUserInGroup) {
      //   throw new Error('User is not a member of the group');
      // }

      const like = this.likeRepository.create({
        user: user,
        post,
      });

      return await this.likeRepository.save(like);
    } catch (error) {
      console.log('error', error);
      throw new Error('Error like not created');
    }
  }

  async findAllByPostId(post_id: number) {
    return await this.likeRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.post', 'post')
      .leftJoinAndSelect('like.user', 'user')
      .where('post.id = :post_id', { post_id })
      .getMany();
  }
  findAll() {
    return this.likeRepository.createQueryBuilder('like').getMany();
  }

  async findOneById(id: number) {
    return await this.likeRepository.findOneBy({ id });
  }

  async update(id: number, updateLikeDto: UpdateLikeDto) {
    const like = await this.likeRepository.findOneBy({ id });
    const updatedLike = { ...like, ...updateLikeDto };
    await this.likeRepository.save(updatedLike);
    return updatedLike;
  }

  async remove(id: number) {
    const like = await this.findOneById(id);
    await this.likeRepository.remove(like);
    return like;
  }
}
