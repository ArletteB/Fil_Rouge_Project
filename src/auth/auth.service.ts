import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(signinAuthDto: SigninAuthDto) {
    const user = await this.userService.findOneByEmail(signinAuthDto.email);
    const validPassword = await bcrypt.compare(
      signinAuthDto.password,
      user.password,
    );
    if (user && validPassword) {
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
    return this.userService.create(signupAuthDto);
  }

  async signin(signinAuthDto: SigninAuthDto) {
    const user = await this.validateUser(signinAuthDto);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.generateJwtToken(payload),
    };
  }
}
