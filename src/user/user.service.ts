import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
    return await this.userRepository.findOneBy({ email });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
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
}
