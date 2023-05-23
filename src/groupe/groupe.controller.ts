import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GroupeService } from './groupe.service';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';

@Controller('groupes')
export class GroupeController {
  constructor(private groupeService: GroupeService) {}

  @Post()
  create(@Body() createGroupeDto: CreateGroupeDto) {
    return this.groupeService.create(createGroupeDto);
  }

  @Get()
  findAll(@Query('postalCode') postalCode: string) {
    if (postalCode) {
      return this.groupeService.findByPostalCode(postalCode);
    } else {
      return this.groupeService.findAll();
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupeService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupeDto: UpdateGroupeDto,
  ) {
    return this.groupeService.update(id, updateGroupeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupeService.remove(id);
  }

  // @Get('filter')
  // findByPostalCode(@Query('postalCode') postalCode: string) {
  //   return this.groupeService.findByPostalCode(postalCode);
  // }
}
