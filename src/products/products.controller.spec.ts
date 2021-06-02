import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { DeleteResult, UpdateResult } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

import { ProductsController } from './products.controller';
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

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should be returns product fail if service throw', async () => {
      service.create = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const mockCreateInvalidDto = mockCreateProductDto();

      expect(await controller.create(mockCreateInvalidDto)).toEqual(
        new InternalServerErrorException(
          'Sorry, it was not possible to perform this task',
        ),
      );
    });

    it('should be called service with correct params', async () => {
      const mockCreateDto = mockCreateProductDto();

      await controller.create(mockCreateDto);
      expect(service.create).toBeCalledWith(mockCreateDto);
    });

    it('should be return success data with repository return', async () => {
      const mockCreateDto = mockCreateProductDto();
      const product = mockProduct(mockCreateDto);

      service.create = jest.fn().mockResolvedValue(product);

      const response = await controller.create(mockCreateDto);

      expect(response).toEqual({
        message: 'Created!',
        data: product,
      });
    });
  });

  describe('findAll()', () => {
    it('should be returns product fail if service throw', async () => {
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
      const products = [
        mockProduct(mockCreateProductDto()),
        mockProduct(mockCreateProductDto()),
      ];

      service.findAll = jest.fn().mockResolvedValue(products);

      const response = await controller.findAll();

      expect(response).toEqual({
        message: '',
        data: products,
      });
    });
  });

  describe('findOne()', () => {
    it('should be returns product fail if service throw', async () => {
      service.findOne = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      const id = faker.datatype.number().toString();

      const response = await controller.findOne(id);

      expect(response).toEqual(
        new InternalServerErrorException(
          'Sorry, it was not possible to perform this task',
        ),
      );
    });

    it('should be called repository with correct params', async () => {
      const id = faker.datatype.number();

      await controller.findOne(String(id));

      expect(service.findOne).toBeCalledWith(id);
    });

    it('should be return success data with repository return', async () => {
      const product = mockProduct(mockCreateProductDto());

      service.findOne = jest.fn().mockResolvedValue(product);

      const response = await controller.findOne(String(product.id));

      expect(response).toEqual({
        message: '',
        data: product,
      });
    });
  });

  describe('update()', () => {
    it('should be returns product fail if service throw', async () => {
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
      const mockUpdateDto = mockUpdateProductDto();

      const id = faker.datatype.number().toString();

      await controller.update(id, mockUpdateDto);
      expect(service.update).toBeCalledWith(+id, mockUpdateDto);
    });

    it('should be return success data with repository return', async () => {
      const mockUpdateDto = mockUpdateProductDto();
      const product = mockProduct(mockUpdateDto);

      const updateResult = new UpdateResult();

      updateResult.affected = 1;

      service.update = jest.fn().mockResolvedValue(updateResult);

      const response = await controller.update(
        product.id.toString(),
        mockUpdateDto,
      );

      expect(response).toEqual({
        message: 'Updated!',
        data: updateResult,
      });
    });
  });

  describe('remove()', () => {
    it('should be returns product fail if service throw', async () => {
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
