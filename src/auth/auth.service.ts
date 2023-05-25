import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordTokenService } from './reset-password/reset-password-token.service';

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
    console.log(forgotPasswordDto);
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);

    const resetToken = await this.resetPasswordTokenService.create(user.id);
    const updateUser = await this.userService.update(user.id, {
      resetPasswordToken: resetToken,
    });
    await this.mailService.sendForgotPasswordMail(
      forgotPasswordDto.email,
      `${process.env.CLIENT_APP_URL}/reset-password/${resetToken.token}`,
    );
    return updateUser;
  }

  async resetPassword(resetToken: string, resetPasswordDto: ResetPasswordDto) {
    const token = await this.resetPasswordTokenService.findOneByToken(
      resetToken.slice(0, -1),
    );
    console.log('token', token);
    if (!token) {
      throw new HttpException('Token not found', 400);
    }
    const user = await this.userService.findOneByEmail(token.user.email);
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    const updateUser = await this.userService.update(user.id, {
      ...user,
      password: await bcrypt.hash(resetPasswordDto.password, 10),
    });
    // await this.resetPasswordTokenService.remove(token.id);
    await this.mailService.sendConfirmResetPasswordMail(user.email);
    return updateUser;
  }
}
