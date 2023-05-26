export class SignupAuthDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  imgProfile?: string;
  bio?: string;
  gender?: string;
  resetPassword: Object;
}
