import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import { GroupeEntity } from './entities/groupe.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { PostCreateDto } from 'src/post/dto/post-create.dto';
import { PostService } from 'src/post/post.service';

@Injectable()
export class GroupeService {
  constructor(
    @InjectRepository(GroupeEntity)
    private readonly groupeRepository: Repository<GroupeEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private postService: PostService,
  ) {}
  async create(createGroupeDto: CreateGroupeDto) {
    try {
      const groupe = await this.groupeRepository.save(createGroupeDto);
      return groupe;
    } catch (error) {
      throw new Error('Error while creating groupe');
    }
  }

  async findAll() {
    try {
      const groupes = await this.groupeRepository
        .createQueryBuilder('gorupe')

        .getMany();
      return groupes;
    } catch (error) {
      throw new Error('Error while getting groupes');
    }
  }
  async findOneById(id: number) {
    try {
      const groupe = await this.groupeRepository
        .createQueryBuilder('groupe')
        .leftJoinAndSelect('groupe.posts', 'post')
        .where('groupe.id = :id', { id })
        .getOne();

      return groupe;
    } catch (error) {
      throw new Error('Error while getting groupe');
    }
  }

  async update(id: number, updateGroupeDto: UpdateGroupeDto) {
    const groupe = await this.groupeRepository.findOneBy({ id });
    const updatedGroupe = { ...groupe, ...updateGroupeDto };
    await this.groupeRepository.save(updatedGroupe);
    return updatedGroupe;
  }

  async remove(id: number) {
    const groupe = await this.findOneById(id);
    await this.groupeRepository.softRemove(groupe);
    return groupe;
  }

  async findByPostalCode(postalCode: string) {
    try {
      const group = await this.groupeRepository
        .createQueryBuilder('groupe')
        .where('groupe.postalCode = :postalCode', { postalCode })
        .getMany();
      return group;
    } catch (error) {
      throw new Error('Error while getting groups');
    }
  }

  async getPostsByGroupId(groupId: number) {
    try {
      const groupe = await this.groupeRepository
        .createQueryBuilder('groupe')
        .leftJoinAndSelect('groupe.posts', 'post')
        .where('groupe.id = :groupId', { groupId })
        .getOne();

      if (!groupe) {
        throw new Error('Group not found');
      }

      return groupe.posts;
    } catch (error) {
      throw new Error('Error while getting posts by group ID');
    }
  }

  async createPost(groupId: number, postCreateDto: PostCreateDto) {
    const groupe = await this.groupeRepository.findOneBy({ id: groupId });

    if (!groupe) {
      throw new Error('Group not found');
    }

    const post = await this.postService.create(postCreateDto);
    groupe.posts.push(post);

    await this.groupeRepository.save(groupe);
    return post;
  }
}
