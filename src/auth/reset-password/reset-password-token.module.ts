import { Module } from '@nestjs/common';
import { ResetPasswordTokenController } from './reset-password-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordTokenEntity } from './entities/reset-password-token.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ResetPasswordTokenService } from './reset-password-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordTokenEntity, UserEntity])],
  controllers: [ResetPasswordTokenController],
  providers: [ResetPasswordTokenService, UserService],
  exports: [ResetPasswordTokenService],
})
export class ResetPasswordTokenModule {}
