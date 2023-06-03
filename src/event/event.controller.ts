import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AddParticipantsDto } from './dto/addParticipant-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post(':creatorUserId')
  createEvent(
    @Param('creatorUserId') creatorUserId: string,
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventService.createEvent(createEventDto, creatorUserId);
  }
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  @Post(':eventId/participants')
  addParticipants(
    @Param('eventId') eventId: string,
    @Body() addParticipantsDto: AddParticipantsDto,
  ) {
    return this.eventService.addParticipants(eventId, addParticipantsDto);
  }
}
