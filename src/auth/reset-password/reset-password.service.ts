import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordTokenEntity } from './entities/reset-token.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { createHmac } from 'crypto';
import { UserService } from 'src/user/user.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';

@Injectable()
export class ResetPasswordTokenService {
  constructor(
    @InjectRepository(ResetPasswordTokenEntity)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordTokenEntity>,
    private readonly userService: UserService,
  ) {}
  async create(userId: string) {
    // const user = await this.userService.findOneByEmail(
    //   createResetPasswordDto.email,
    // );
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }
    try {
      const token = createHmac('sha256', uuidv4()).digest('hex');
      return await this.resetPasswordTokenRepository.save({
        token,
        userId,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOneByEmail(email: string) {
    console.log('email', email);
    const user: any = await this.userService.findOneByEmail(email);
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = await this.resetPasswordTokenRepository.findOne({
      where: { user: user },
      relations: ['user'],
    });

    console.log('findOneByEmail token', token);

    return token;
  }
  async findOne(token: string) {
    const tokenFound = await this.resetPasswordTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    return tokenFound;
  }

  async remove(id: number) {
    return await this.resetPasswordTokenRepository.softDelete(id);
  }
}
