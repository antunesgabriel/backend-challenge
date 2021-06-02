import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import * as cpf from '@fnando/cpf';

import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';

const mockCreateClientDto = (): CreateClientDto => {
  return {
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    document: cpf.generate(true),
    email: faker.internet.email(),
    gender: faker.random.arrayElement(['Masculine', 'Feminine']),
    code: faker.random.alpha({ count: 8 }),
  };
};

const mockClient = (clientDto: CreateClientDto): Client => {
  return {
    id: Math.round(Math.random() * 300 + 1),
    name: clientDto.name,
    document: clientDto.document,
    email: clientDto.email,
    gender: clientDto.gender,
    code: clientDto.code,
  };
};

describe('ClientsRepository', () => {
  let repository: ClientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsRepository],
    }).compile();

    repository = module.get<ClientsRepository>(ClientsRepository);
    repository.save = jest.fn();
    repository.create = jest.fn();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createClient()', () => {
    it('should be called save with correct params', async () => {
      const clientDto = mockCreateClientDto();
      const client = mockClient(clientDto);

      repository.create = jest.fn().mockReturnValue(client);
      repository.save = jest.fn().mockReturnValue(client);

      await repository.createClient(clientDto);
      expect(repository.save).toBeCalledWith(client);
    });
  });
});
