import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AddParticipantsDto } from './dto/addParticipant-event.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  @UseGuards(JwtAuthGuard)
  async createEvent(
    createEventDto: CreateEventDto,
    creatorUserId: string,
  ): Promise<EventEntity> {
    try {
      const event = this.eventRepository.create(createEventDto);
      event.title = createEventDto.title;
      event.dateEvent = createEventDto.dateEvent;
      event.description = createEventDto.description;
      event.adress = createEventDto.adress;

      const completeImageUrl = `${process.env.API_SUPABASE_EVENT_URL}/${createEventDto.cover}`;
      event.cover = completeImageUrl;

      const creatorUser = await this.userRepository.findOne({
        where: { id: creatorUserId },
      });
      if (!creatorUser) {
        throw new Error('Creator user not found');
      }

      event.CreatorEvent = creatorUser;

      return await this.eventRepository.save(event);
    } catch (error) {
      throw new Error('Error' + error.message + 'while creating event');
    }
  }

  async findAll() {
    try {
      const events = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.CreatorEvent', 'CreatorEvent')
        .orderBy('event.id', 'DESC')
        .getMany();
      return events;
    } catch (error) {
      throw new Error('Error while getting events' + error.message);
    }
  }

  async findOneById(id: string) {
    try {
      const event = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.CreatorEvent', 'CreatorEvent') // Préchargez la relation du créateur
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

  async addParticipant(
    eventId: string,
    addParticipantsDto: AddParticipantsDto,
  ): Promise<EventEntity> {
    try {
      const event = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.participants', 'participants')
        .where('event.id = :eventId', { eventId: +eventId }) // Convertissez eventId en nombre
        .getOneOrFail();
      const userToAdd = await this.userRepository.findOneOrFail(
        addParticipantsDto.userId,
      );
      const isUserAlreadyParticipant = event.participants.some(
        (participant) => participant.id === userToAdd.id,
      );

      if (isUserAlreadyParticipant) {
        throw new BadRequestException(
          'User is already a participant in this event',
        );
      }

      event.participants.push(userToAdd);
      await this.eventRepository.save(event);

      return event;
    } catch (error) {
      throw new Error(
        'Error while adding participant to event: ' + error.message,
      );
    }
  }

  async addUserToEvent(userId: string, eventId: string): Promise<EventEntity> {
    console.log('userId', userId);
    // Vérifiez si l'utilisateur et l'événement existent
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.participants', 'participants')
      .where('event.id = :eventId', { eventId })
      .getOne();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Assurez-vous que l'utilisateur n'est pas déjà inscrit à l'événement
    const isUserAlreadyRegistered = event.participants.some(
      (participant) => participant.id === userId,
    );
    if (isUserAlreadyRegistered) {
      throw new Error(
        `User with ID ${userId} is already registered for Event with ID ${eventId}`,
      );
    }

    // Ajoutez l'utilisateur à la liste des participants de l'événement
    event.participants.push(user);

    // Enregistrez les modifications dans la base de données
    await this.eventRepository.save(event);

    return event;
  }
}
