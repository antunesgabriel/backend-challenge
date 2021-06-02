import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import * as cpf from '@fnando/cpf';

import { emailIsValid } from '../shared/validators/email.validation';

import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientsRepository)
    private readonly clientsRepository: ClientsRepository,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<any> {
    if (!emailIsValid(createClientDto.email)) {
      throw new BadRequestException({ message: 'Invalid email' });
    }

    if (!cpf.isValid(createClientDto.document)) {
      throw new BadRequestException({ message: 'Invalid document' });
    }

    return await this.clientsRepository.createClient(createClientDto);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientsRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    return await this.clientsRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<UpdateResult> {
    if (updateClientDto.email && !emailIsValid(updateClientDto.email)) {
      throw new BadRequestException({ message: 'Invalid email' });
    }

    if (updateClientDto.document && !cpf.isValid(updateClientDto.document)) {
      throw new BadRequestException({ message: 'Invalid document' });
    }

    return await this.clientsRepository.update(id, updateClientDto);
  }

  async remove(id: number) {
    return await this.clientsRepository.delete(id);
  }
}
