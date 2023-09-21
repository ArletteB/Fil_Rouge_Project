import {
  NotFoundException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordTokenEntity } from './entities/reset-password-token.entity';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import { UserService } from '../../user/user.service';
import { UpdateResetPasswordTokenDto } from './dto/update-reset-password.dto';

@Injectable()
export class ResetPasswordTokenService {
  constructor(
    @InjectRepository(ResetPasswordTokenEntity)
    private resetPasswordTokenRepository: Repository<ResetPasswordTokenEntity>,
    private readonly userService: UserService,
  ) {}
  async create(userId: string) {
    try {
      const token = createHmac('sha256', `${process.env.JWT_SECRET}`)
        .update(`${Date.now()}`)
        .digest('hex');

      // console.log('token', token);
      const user = await this.userService.findOne(userId);

      console.log('user', user);
      return await this.resetPasswordTokenRepository.save({ token, user });
    } catch (error) {
      console.log(error);
      // throw new BadRequestException(error);
      throw new HttpException(' not found', 400);
    }
  }
  async findAll() {
    try {
      return await this.resetPasswordTokenRepository
        .createQueryBuilder('resetPasswordToken')
        .leftJoinAndSelect('resetPasswordToken.user', 'user')
        .orderBy('resetPasswordToken.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findOneByToken(token: string) {
    const findToken = await this.resetPasswordTokenRepository
      .createQueryBuilder('resetPasswordToken')
      .leftJoinAndSelect('resetPasswordToken.user', 'user')
      .where('resetPasswordToken.token = :token', { token })
      .getOne();

    return findToken;
  }

  async findOneByEmail(email: string) {
    console.log('email', email);
    const user: any = await this.userService.findOneByEmail(email);
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const token = await this.resetPasswordTokenRepository.findOne({
      where: { user: user },
      relations: ['user'],
    });

    console.log('findOneByEmail token', token);

    return token;
  }
  // async findOne(token: string) {
  //   const tokenFound = await this.resetPasswordTokenRepository.findOne({
  //     where: { token },
  //     relations: ['user'],
  //   });

  //   return tokenFound;
  // }

  async update(
    id: string,
    updateResetPasswordTokenDto: UpdateResetPasswordTokenDto,
  ) {
    try {
      return await this.resetPasswordTokenRepository.update(
        id,
        updateResetPasswordTokenDto,
      );
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.resetPasswordTokenRepository.softDelete(id);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
