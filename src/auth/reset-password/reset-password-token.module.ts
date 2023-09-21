import { Module } from '@nestjs/common';
import { ResetPasswordTokenController } from './reset-password-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordTokenEntity } from './entities/reset-password-token.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { ResetPasswordTokenService } from './reset-password-token.service';
import { GroupeEntity } from '../../groupe/entities/groupe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResetPasswordTokenEntity,
      UserEntity,
      GroupeEntity,
    ]),
  ],
  controllers: [ResetPasswordTokenController],
  providers: [ResetPasswordTokenService, UserService],
  exports: [ResetPasswordTokenService],
})
export class ResetPasswordTokenModule {}
