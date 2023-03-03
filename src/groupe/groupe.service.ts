import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import { GroupeEntity } from './entities/groupe.entity';

@Injectable()
export class GroupeService {
  constructor(
    @InjectRepository(GroupeEntity)
    private readonly groupeRepository: Repository<GroupeEntity>,
  ) {}
  async create(createGroupeDto: CreateGroupeDto) {
    try {
      const groupe = await this.groupeRepository.save(createGroupeDto);
      return groupe;
    } catch (error) {
      throw new Error('Error while creating groupe');
    }
  }

  async findAll() {
    try {
      const groupes = await this.groupeRepository
        .createQueryBuilder('gorupe')
        .getMany();
      return groupes;
    } catch (error) {
      throw new Error('Error while getting groupes');
    }
  }

  async findOneById(id: number) {
    try {
      const groupe = await this.groupeRepository.findOneBy({ id });
      return groupe;
    } catch (error) {
      throw new Error('Error while getting groupe');
    }
  }

  async update(id: number, updateGroupeDto: UpdateGroupeDto) {
    const groupe = await this.groupeRepository.findOneBy({ id });
    const updatedGroupe = { ...groupe, ...updateGroupeDto };
    await this.groupeRepository.save(updatedGroupe);
    return updatedGroupe;
  }

  async remove(id: number) {
    const groupe = await this.findOneById(id);
    await this.groupeRepository.softRemove(groupe);
    return groupe;
  }
}
