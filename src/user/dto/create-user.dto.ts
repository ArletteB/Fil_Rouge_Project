export class CreateUserDto {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  imgProfile?: string;
  bio?: string;
  gender?: string;
  resetPasswordToken?: Object;
}
