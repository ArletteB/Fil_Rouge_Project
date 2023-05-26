export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  password: string;
  imgProfile?: string;
  bio?: string;
  gender?: string;
  resetPasswordToken?: Object;
}
