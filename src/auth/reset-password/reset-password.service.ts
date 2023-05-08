import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordEntity } from './entities/token-reset.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { UserService } from 'src/user/user.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPasswordEntity)
    private readonly resetPasswordRepository: Repository<ResetPasswordEntity>,
    private readonly userService: UserService,
  ) {}

  async create(createResetPasswordDto: CreateResetPasswordDto) {
    const user = await this.userService.findOneByEmail(
      createResetPasswordDto.email,
    );
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const tokenFound = await this.findOneByEmail(createResetPasswordDto.email);
    if (tokenFound) {
      return tokenFound;
    }

    const token = uuidv4();

    const newToken = await this.resetPasswordRepository.create({
      user: user,
      token,
    });

    return this.resetPasswordRepository.save(newToken);
  }

  async findOneByEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const token = await this.resetPasswordRepository
      .createQueryBuilder('resetPassword')
      .leftJoinAndSelect('resetPassword.user', 'user')
      .where('user.email = :email', { email })
      .getOne();
    return token;
  }

  findAll() {
    return `This action returns all resetPassword`;
  }

  findOne(token: string) {
    const tokenFound = this.resetPasswordRepository.findOne({
      where: { token },
    });
    if (!tokenFound) {
      throw new HttpException('Token not found', 404);
    }
    return tokenFound;
  }

  async remove(id: number) {
    return await this.resetPasswordRepository.softDelete(id);
  }
}
