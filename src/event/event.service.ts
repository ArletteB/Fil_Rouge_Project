import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { AddParticipantsDto } from './dto/addParticipant-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async createEvent(
    createEventDto: CreateEventDto,
    creatorUserId: string,
  ): Promise<EventEntity> {
    const event = new EventEntity();
    event.title = createEventDto.title;
    event.cover = createEventDto.cover;
    event.dateEvent = createEventDto.dateEvent;
    event.description = createEventDto.description;
    event.adress = createEventDto.adress;

    const creatorUser = await this.userRepository.findOne({
      where: { id: creatorUserId },
    });
    if (!creatorUser) {
      throw new Error('Creator user not found');
    }

    event.CreatorEvent = creatorUser;

    return await this.eventRepository.save(event);
  }

  async findAll() {
    try {
      const events = await this.eventRepository
        .createQueryBuilder('event')
        .getMany();
      return events;
    } catch (error) {
      throw new Error('Error while getting events');
    }
  }

  async findOneById(id: string) {
    try {
      const event = await this.eventRepository
        .createQueryBuilder('event')
        .where('event.id = :id', { id })
        .getOne();

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      return event;
    } catch (error) {
      throw new Error('Error while getting event');
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.findOneBy({ id });
    const updatedEvent = { ...event, ...updateEventDto };
    await this.eventRepository.save(updatedEvent);
    return updatedEvent;
  }

  async remove(id: string) {
    const event = await this.findOneById(id);
    await this.eventRepository.softRemove(event);
    return event;
  }

  async addParticipants(
    eventId: string,
    addParticipantsDto: AddParticipantsDto,
  ) {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.participants', 'participants')
      .where('event.id = :eventId', { eventId })
      .getOne();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const participantsToAdd = await this.userRepository.find({
      where: { id: In(addParticipantsDto.participants) },
    });

    if (!participantsToAdd || participantsToAdd.length === 0) {
      throw new BadRequestException('Invalid participants');
    }

    event.participants.push(...participantsToAdd);

    await this.eventRepository.save(event);

    return event;
  }
}
