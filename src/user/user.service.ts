import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { GroupeEntity } from 'src/groupe/entities/groupe.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(GroupeEntity)
    private groupeRepository: Repository<GroupeEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      return await this.userRepository.save(createUserDto);
    } catch (error) {
      throw new Error('Error while creating user');
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw (new BadRequestException(), 'Error while updating user');
    }
  }

  async softRemove(id: string) {
    return await this.userRepository.softDelete(id);
  }

  async updatePassword(user: UserEntity, password: string) {
    try {
      user.password = await bcrypt.hash(password, 10);
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new Error('Error while updating password');
    }
  }

  async joinGroup(userId: string, groupId: number) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .leftJoinAndSelect('user.groupes', 'groupes')
        .getOne();
      console.log(user);
      if (!user) {
        throw new Error('User not found');
      }

      const group = await this.groupeRepository.findOne({
        where: { id: groupId },
      });

      if (!group) {
        throw new Error('Group not found');
      }
      user.groupes.push(group);

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      throw new Error('Error while joining group');
    }
  }

  async isUserInGroup(userId: string, groupId: number): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.groupes', 'groupes')
      .where('user.id = :userId', { userId })
      .andWhere('groupes.id = :groupId', { groupId })
      .getOne();

    return !!user;
  }
}
