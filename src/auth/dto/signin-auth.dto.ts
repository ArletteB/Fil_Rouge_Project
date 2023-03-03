import { PartialType } from '@nestjs/mapped-types';
import { SignupAuthDto } from './signup-auth.dto';

export class SigninAuthDto extends PartialType(SignupAuthDto) {}
