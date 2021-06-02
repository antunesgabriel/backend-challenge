import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsRepository)
    private readonly productRepository: ProductsRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    return await this.productRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.productRepository.delete(id);
  }
}
