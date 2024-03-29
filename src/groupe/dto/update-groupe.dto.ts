import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupeDto } from './create-groupe.dto';

export class UpdateGroupeDto extends PartialType(CreateGroupeDto) {
  name?: string;
  description?: string;
  cover?: string;
  postalCode?: string;
  city?: string;
}
