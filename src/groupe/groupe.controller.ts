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
import { PostService } from 'src/post/post.service';
import { PostCreateDto } from 'src/post/dto/post-create.dto';

@Controller('groupes')
export class GroupeController {
  constructor(
    private groupeService: GroupeService,
    private postService: PostService,
  ) {}

  @Post()
  async create(@Body() createGroupeDto: CreateGroupeDto) {
    const groupe = await this.groupeService.create(createGroupeDto);
    const postCreateDto: PostCreateDto = {
      legend: 'Nouveau post',
      description: '',
      image: '',
    };
    await this.postService.create(postCreateDto);

    return groupe;
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

  @Get(':id/posts')
  getPostsByGroupId(@Param('id', ParseIntPipe) id: number) {
    return this.groupeService.getPostsByGroupId(id);
  }
}
