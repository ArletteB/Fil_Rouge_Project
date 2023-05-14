import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordTokenService } from './reset-password/reset-password.service';

import { CreateResetPasswordDto } from './reset-password/dto/create-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private resetPasswordTokenService: ResetPasswordTokenService,
    private mailService: MailService,
  ) {}

  async validateUser(signinAuthDto: SigninAuthDto) {
    const user = await this.userService.findOneByEmail(signinAuthDto.email);
    const validPassword = await bcrypt.compare(
      signinAuthDto.password,
      user.password,
    );
    if (user && validPassword) {
      // TODO:  Cacher le password plutard
      const { password, ...result } = user;
      return result;
    } else {
      throw new Error('Invalid email or password');
    }
  }

  generateJwtToken(payload) {
    return this.jwtService.sign(payload);
  }

  signup(signupAuthDto: SignupAuthDto) {
    // signup => s'inscrire
    return this.userService.create(signupAuthDto);
  }

  async signin(signinAuthDto: SigninAuthDto) {
    // signin => se connecter
    const user = await this.validateUser(signinAuthDto);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.generateJwtToken(payload),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const token = await this.resetPasswordTokenService.create(user.id);

    const userUpdated = await this.userService.update(user.id, {
      resetPassword: token.id,
    });
    console.log('userUpdated', userUpdated);
    // await this.mailService.ForgotPasswordSendMail(
    //   forgotPasswordDto.email,
    //   `${process.env.CLIENT_APP_URL}/reset-password/${token.token}`,
    // );
    // return userUpdated;
  }

  // async forgotPassword(createResetPasswordDto: CreateResetPasswordDto) {
  //   const token = await this.ResetPasswordTokenService.create(
  //     createResetPasswordDto,
  //   );

  //   return token;
  // }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const resetPassword = await this.resetPasswordTokenService.findOne(token);
    if (!resetPassword) {
      throw new BadRequestException('Invalid token');
    }
    const user = await this.userService.findOneByEmail(
      resetPassword.user.email,
    );
    if (!user) {
      throw new BadRequestException('Invalid token');
    }
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 12);

    // await this.userService.update(user.id, { password: hashedPassword });
    // return {
    //   message: 'Password updated successfully',
    // };

    // await this.resetPasswordTokenService.remove(resetPassword.id);
    // return await this.userService.update(user.id, { password: hashedPassword });
  }
}
