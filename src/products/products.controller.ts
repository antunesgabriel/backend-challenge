import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BaseController } from '../shared/class/base.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController extends BaseController {
  constructor(private readonly productsService: ProductsService) {
    super();
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const data = await this.productsService.create(createProductDto);

      return this.sucessResponse(data, 'Created!');
    } catch (_) {
      return this.errorResponse();
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.productsService.findAll();

      return this.sucessResponse(data);
    } catch (_) {
      return this.errorResponse();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.productsService.findOne(+id);

      return this.sucessResponse(data);
    } catch (_) {
      return this.errorResponse('Product not exist', 404);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const data = await this.productsService.update(+id, updateProductDto);

      return this.sucessResponse(data, 'Updated!');
    } catch (_) {
      return this.errorResponse();
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.productsService.remove(+id);

      return this.sucessResponse(data, 'Deleted!');
    } catch (err) {
      return this.errorResponse();
    }
  }
}
