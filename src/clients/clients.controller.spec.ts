import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import * as cpf from '@fnando/cpf';

import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';

const mockCreateClientDto = (): CreateClientDto => {
  return {
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    document: cpf.generate(true),
    email: faker.internet.email(),
    gender: faker.random.arrayElement(['Masculine', 'Feminine']),
    code: faker.random.alpha({ count: 8 }),
  };
};

const mockUpdateClientDto = (): CreateClientDto => {
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

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should be returns client fail if service throw', async () => {
      service.create = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const mockCreateInvalidDto: any = {};

      const response = await controller.create(mockCreateInvalidDto);

      await expect(response).toEqual(
        new InternalServerErrorException(
          'Sorry, it was not possible to perform this task',
        ),
      );
    });

    it('should be called service with correct params', async () => {
      const mockCreateDto = mockCreateClientDto();

      await controller.create(mockCreateDto);
      expect(service.create).toBeCalledWith(mockCreateDto);
    });

    it('should be return success data with repository return', async () => {
      const mockCreateDto = mockCreateClientDto();
      const client = mockClient(mockCreateDto);

      service.create = jest.fn().mockResolvedValue(client);

      const response = await controller.create(mockCreateDto);

      expect(response).toEqual({
        message: 'Created!',
        data: client,
      });
    });
  });

  describe('findAll()', () => {
    it('should be returns client fail if service throw', async () => {
      service.findAll = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const response = await controller.findAll();

      await expect(response).toEqual(
        new InternalServerErrorException(
          'Sorry, it was not possible to perform this task',
        ),
      );
    });

    it('should be called service findAll method', async () => {
      await controller.findAll();
      expect(service.findAll).toBeCalledTimes(1);
    });

    it('should be return success data with repository return', async () => {
      const clients = [
        mockClient(mockCreateClientDto()),
        mockClient(mockCreateClientDto()),
      ];

      service.findAll = jest.fn().mockResolvedValue(clients);

      const response = await controller.findAll();

      expect(response).toEqual({
        message: '',
        data: clients,
      });
    });
  });

  describe('findOne()', () => {
    it('should be returns client fail if service throw', async () => {
      service.findOne = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const id = faker.datatype.number().toString();

      const response = await controller.findOne(id);

      await expect(response).toEqual(
        new BadRequestException('Client not found'),
      );
    });

    it('should be called repository with correct params', async () => {
      const id = faker.datatype.number();

      await controller.findOne(String(id));

      expect(service.findOne).toBeCalledWith(id);
    });

    it('should be return success data with repository return', async () => {
      const client = mockClient(mockCreateClientDto());

      service.findOne = jest.fn().mockResolvedValue(client);

      const response = await controller.findOne(String(client.id));

      expect(response).toEqual({
        message: '',
        data: client,
      });
    });
  });

  describe('update()', () => {
    it('should be returns client fail if service throw', async () => {
      service.update = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const invalidParams: any = {};

      const response = await controller.update(invalidParams, invalidParams);

      await expect(response).toEqual(
        new InternalServerErrorException(
          'Sorry, it was not possible to perform this task',
        ),
      );
    });

    it('should be called service with correct params', async () => {
      const mockUpdateDto = mockUpdateClientDto();

      const id = faker.datatype.number().toString();

      await controller.update(id, mockUpdateDto);
      expect(service.update).toBeCalledWith(+id, mockUpdateDto);
    });

    it('should be return success data with repository return', async () => {
      const mockUpdateDto = mockUpdateClientDto();
      const client = mockClient(mockUpdateDto);

      const updateResult = new UpdateResult();

      updateResult.affected = 1;

      service.update = jest.fn().mockResolvedValue(updateResult);

      const response = await controller.update(
        client.id.toString(),
        mockUpdateDto,
      );

      expect(response).toEqual({
        message: 'Updated!',
        data: updateResult,
      });
    });
  });

  describe('remove()', () => {
    it('should be returns client fail if service throw', async () => {
      service.remove = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const invalidParams: any = {};

      const response = await controller.remove(invalidParams);

      await expect(response).toEqual(
        new InternalServerErrorException(
          'Sorry, it was not possible to perform this task',
        ),
      );
    });

    it('should be called service with correct params', async () => {
      const id = faker.datatype.number().toString();

      await controller.remove(id);
      expect(service.remove).toBeCalledWith(+id);
    });

    it('should be return success data with repository return', async () => {
      const deleteResult = new DeleteResult();

      const id = faker.datatype.number().toString();

      deleteResult.affected = 1;

      service.remove = jest.fn().mockResolvedValue(deleteResult);

      const response = await controller.remove(id);

      expect(response).toEqual({
        message: 'Deleted!',
        data: deleteResult,
      });
    });
  });
});
