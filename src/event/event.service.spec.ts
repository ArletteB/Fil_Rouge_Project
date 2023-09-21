import { Repository } from 'typeorm';
import { EventService } from './event.service';
import { EventEntity } from './entities/event.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UserEntity } from '../user/entities/user.entity';

// Créez un mock du repository
class MockRepository {
  create = jest.fn();
  save = jest.fn();
}

// Créez un mock du service UserEntityService (si nécessaire)
class MockUserEntityService {
  // Mockez les méthodes nécessaires du service ici
}

// Créez un mock pour UserEntityRepository
class MockUserEntityRepository {
  findOne = jest.fn().mockResolvedValue({
    id: 'creatorUserId', // L'ID de l'utilisateur fictif
    // Autres propriétés de l'utilisateur fictif
  });
}

describe('EventService', () => {
  let service: EventService;
  let eventRepository: Repository<EventEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(EventEntity),
          useClass: MockRepository, // Utilisez le mock du repository EventEntity
        },
        {
          provide: getRepositoryToken(UserEntity), // Utilisez le mock du repository UserEntity
          useClass: MockUserEntityRepository,
        },
        // Mockez d'autres dépendances si nécessaire
        {
          provide: MockUserEntityService, // Exemple de mock de service
          useClass: MockUserEntityService,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get<Repository<EventEntity>>(
      getRepositoryToken(EventEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      // Créez un objet CreateEventDto simulé pour le test
      const createEventDto: CreateEventDto = {
        title: 'Sorti au Parc',
        dateEvent: new Date(),
        description:
          "Afin de finir l'été en beauté, nous vous proposons une sortie au parc",
        adress: '10 rue de la paix, 33000 Bordeaux',
        cover: 'parc.jpg',
        creatorUserId: 'creatorUserId', // L'ID de l'utilisateur fictif
      };

      const createdEvent = { ...createEventDto }; // Copiez les données de createEventDto
      const saveEvent = { ...createEventDto }; // Copiez les données de createEventDto

      const createMock = jest.fn().mockReturnValue(createdEvent);
      const saveMock = jest.fn().mockReturnValue(saveEvent);

      eventRepository.create = createMock;
      eventRepository.save = saveMock;

      // Appelez la méthode createEvent du service
      const result = await service.createEvent(createEventDto, 'creatorUserId');

      // Vérifiez que le service a bien créé l'événement en utilisant le mock du repository
      expect(eventRepository.create).toHaveBeenCalledWith(createEventDto);
      expect(eventRepository.save).toHaveBeenCalledWith(createdEvent);

      // Vérifiez que le résultat retourné par la méthode est correct
      expect(result).toEqual(saveEvent);
    });
  });
});
