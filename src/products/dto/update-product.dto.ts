import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Fabrication } from '../entities/product.entity';

import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: Fabrication, example: 'National' })
  fabrication: 'National' | 'Imported';

  @ApiProperty()
  size: number;

  @ApiProperty()
  value: number;
}
