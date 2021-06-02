import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import * as cpf from '@fnando/cpf';

import { ClientsRepository } from './clients.repository';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { Client } from './entities/client.entity';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateResult } from 'typeorm';

const mockCreateClientDto = (): CreateClientDto => {
  return {
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    document: cpf.generate(true),
    email: faker.internet.email(),
    gender: faker.random.arrayElement(['Masculine', 'Feminine']),
    code: faker.random.alpha({ count: 8 }),
  };
};

const mockUpdateClientDto = (): UpdateClientDto => {
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

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: ClientsRepository;

  beforeEach(async () => {
    const clientRepositoryMock = {
      createClient: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneOrFail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: ClientsRepository,
          useFactory: () => clientRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<ClientsRepository>(ClientsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should be throw if repository throw', async () => {
      repository.createClient = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const mockCreateInvalidDto: any = {};

      await expect(service.create(mockCreateInvalidDto)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should be not throw if repository returns', async () => {
      const mockCreateDto = mockCreateClientDto();

      await expect(service.create(mockCreateDto)).resolves.not.toThrow();
    });

    it('should be called repository with correct params', async () => {
      const mockCreateDto = mockCreateClientDto();

      await service.create(mockCreateDto);
      expect(repository.createClient).toBeCalledWith(mockCreateDto);
    });

    it('should be return when repository return', async () => {
      const mockCreateDto = mockCreateClientDto();
      const client = mockClient(mockCreateDto);

      repository.createClient = jest.fn().mockReturnValue(client);

      expect(await service.create(mockCreateDto)).toEqual(client);
    });
  });

  describe('update()', () => {
    it('should be throw if repository throw', async () => {
      repository.update = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const mockUpdateInvalidDto: any = {};

      await expect(service.update(0, mockUpdateInvalidDto)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should be not throw if repository returns', async () => {
      const mockUpdateInvalidDto = mockUpdateClientDto();

      await expect(
        service.update(1, mockUpdateInvalidDto),
      ).resolves.not.toThrow();
    });

    it('should be called repository with correct params', async () => {
      const mockUpdateInvalidDto = mockUpdateClientDto();

      await service.update(1, mockUpdateInvalidDto);

      expect(repository.update).toBeCalledWith(1, mockUpdateInvalidDto);
    });

    it('should be return an affected row in the repository call', async () => {
      const updateResult = new UpdateResult();
      updateResult.affected = 1;

      repository.update = jest.fn().mockResolvedValue(updateResult);

      const mockUpdateInvalidDto = mockUpdateClientDto();

      const result = await service.update(1, mockUpdateInvalidDto);

      expect(result.affected).toEqual(1);
    });
  });

  describe('findAll()', () => {
    it('should be called repository without passing parameters', async () => {
      await service.findAll();
      expect(repository.find).toBeCalledWith();
    });

    it('should be return when repository return', async () => {
      const mockReturns = [
        mockClient(mockCreateClientDto()),
        mockClient(mockCreateClientDto()),
      ];

      repository.find = jest.fn().mockResolvedValue(mockReturns);

      expect(await service.findAll()).toEqual(mockReturns);
    });
  });

  describe('remove()', () => {
    it('should be throw if repository throw', async () => {
      repository.delete = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      await expect(service.remove(1)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should be not throw if repository returns', async () => {
      const id = faker.datatype.number();
      await expect(service.remove(id)).resolves.not.toThrow();
    });

    it('should be called repository with correct params', async () => {
      const id = faker.datatype.number();
      await service.remove(id);
      expect(repository.delete).toBeCalledWith(id);
    });
  });

  describe('findOne()', () => {
    it('should be throw if repository throw', async () => {
      repository.findOneOrFail = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const id = faker.datatype.number();

      await expect(service.findOne(id)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should be not throw if repository returns', async () => {
      const id = faker.datatype.number();
      await expect(service.findOne(id)).resolves.not.toThrow();
    });

    it('should be called repository with correct params', async () => {
      const id = faker.datatype.number();
      await service.findOne(id);
      expect(repository.findOneOrFail).toBeCalledWith(id);
    });

    it('should be return when repository return', async () => {
      const mockData = mockClient(mockCreateClientDto());
      repository.findOneOrFail = jest.fn().mockResolvedValue(mockData);

      const result = await service.findOne(mockData.id);
      expect(result).toEqual(mockData);
    });
  });
});
