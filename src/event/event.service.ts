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
    try {
      const event = new EventEntity();
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

  async addParticipants(eventId: string, userId: string) {
    try {
      const event = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.participants', 'participants')
        .where('event.id = :eventId', { eventId })
        .getOne();

      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!event || !user) {
        throw new NotFoundException('Event or user not found');
      }

      const isAlreadyParticipant = event.participants.some(
        (participant) => participant.id === user.id,
      );

      if (isAlreadyParticipant) {
        throw new BadRequestException(
          'User is already registered for the event',
        );
      }

      event.participants.push(user);
      await this.eventRepository.save(event);

      return 'User registered for the event';
    } catch (error) {
      throw new Error(
        'Error while registering user for the event: ' + error.message,
      );
    }
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

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const userToAdd = await this.userRepository.findOne(
        addParticipantsDto.userId,
      );
      if (!userToAdd) {
        throw new NotFoundException('User not found');
      }

      // Vérifiez si l'utilisateur n'est pas déjà inscrit à l'événement
      const isUserAlreadyParticipant = event.participants.some(
        (participant) => participant.id === userToAdd.id,
      );
      console.log(isUserAlreadyParticipant);

      if (isUserAlreadyParticipant) {
        throw new BadRequestException(
          'User is already a participant in this event',
        );
      }

      event.participants.push(userToAdd);

      return await this.eventRepository.save(event);
    } catch (error) {
      throw new Error(
        'Error while adding participant to event: ' + error.message,
      );
    }
  }

  async addUserToEvent(userId: string, eventId: string): Promise<EventEntity> {
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
