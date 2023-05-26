import { HttpException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

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

  findOneById(id: number) {
    try {
      const event = this.eventRepository
        .createQueryBuilder('event')
        .where('event.id = :id', { id })
        .getOne();
      return event;
    } catch (error) {
      throw new Error('Error while getting event');
    }
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
