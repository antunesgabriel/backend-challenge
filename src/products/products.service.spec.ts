import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { DeleteResult, UpdateResult } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

const mockCreateProductDto = (): CreateProductDto => {
  return {
    name: faker.commerce.productName(),
    code: faker.random.alpha({ count: 8 }),
    fabrication: faker.random.arrayElement(['National', 'Imported']),
    size: faker.datatype.number(),
    value: Number(faker.commerce.price().replace(',', '.')),
  };
};

const mockUpdateProductDto = (): UpdateProductDto => {
  return {
    name: faker.commerce.productName(),
    code: faker.random.alpha({ count: 8 }),
    fabrication: faker.random.arrayElement(['National', 'Imported']),
    size: faker.datatype.number(),
    value: Number(faker.commerce.price().replace(',', '.')),
  };
};

const mockProduct = (
  productDto: CreateProductDto | UpdateProductDto,
): Product => {
  return {
    id: Math.round(Math.random() * 300 + 1),
    name: productDto.name,
    code: productDto.code,
    fabrication: productDto.fabrication,
    size: productDto.size,
    value: productDto.value,
  };
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  beforeEach(async () => {
    const productRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneOrFail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useFactory: () => productRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should be throw if repository throw', async () => {
      const mockData = mockCreateProductDto();
      const mockEntity = mockProduct(mockData);

      repository.create = jest.fn().mockReturnValue(mockEntity);

      repository.save = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      await expect(service.create(mockData)).rejects.toThrow();
    });

    it('should be not throw if repository returns', async () => {
      const mockData = mockCreateProductDto();

      await expect(service.create(mockData)).resolves.not.toThrow();
    });

    it('should be called repository with correct params', async () => {
      const mockData = mockCreateProductDto();
      const mockEntity = mockProduct(mockData);

      repository.create = jest.fn().mockReturnValue(mockEntity);

      await service.create(mockData);
      expect(repository.create).toBeCalledWith(mockData);

      expect(repository.save).toBeCalledWith(mockEntity);
    });

    it('should be return when repository return', async () => {
      const mockData = mockCreateProductDto();
      const mockEntity = mockProduct(mockData);

      repository.create = jest.fn().mockResolvedValue(mockEntity);
      repository.save = jest.fn().mockResolvedValue(mockEntity);

      expect(await service.create(mockData)).toEqual(mockEntity);
    });
  });

  describe('update()', () => {
    it('should be throw if repository throw', async () => {
      const mockData = mockUpdateProductDto();

      const id = faker.datatype.number();

      repository.update = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      await expect(service.update(id, mockData)).rejects.toThrow();
    });

    it('should be not throw if repository returns', async () => {
      const mockData = mockCreateProductDto();

      await expect(service.create(mockData)).resolves.not.toThrow();
    });

    it('should be called repository with correct params', async () => {
      const mockUpdateInvalidDto = mockUpdateProductDto();

      await service.update(1, mockUpdateInvalidDto);

      expect(repository.update).toBeCalledWith(1, mockUpdateInvalidDto);
    });

    it('should be return an affected row in the repository call', async () => {
      const updateResult = new UpdateResult();
      updateResult.affected = 1;

      repository.update = jest.fn().mockResolvedValue(updateResult);

      const mockData = mockUpdateProductDto();

      const result = await service.update(1, mockData);

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
        mockProduct(mockCreateProductDto()),
        mockProduct(mockCreateProductDto()),
      ];

      repository.find = jest.fn().mockResolvedValue(mockReturns);

      expect(await service.findAll()).toEqual(mockReturns);
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
      const mockData = mockProduct(mockCreateProductDto());
      repository.findOneOrFail = jest.fn().mockResolvedValue(mockData);

      const result = await service.findOne(mockData.id);
      expect(result).toEqual(mockData);
    });
  });

  describe('remove()', () => {
    it('should be throw if repository throw', async () => {
      repository.delete = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const id = faker.datatype.number();

      await expect(service.remove(id)).rejects.toThrow(
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

    it('should be return an affected row in the repository call', async () => {
      const deleteResult = new DeleteResult();
      deleteResult.affected = 1;

      const id = faker.datatype.number();

      repository.delete = jest.fn().mockResolvedValue(deleteResult);

      const result = await service.remove(id);

      expect(result.affected).toEqual(1);
    });
  });
});
