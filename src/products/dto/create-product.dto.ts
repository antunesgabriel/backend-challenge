import { ApiProperty } from '@nestjs/swagger';
import { Fabrication } from '../entities/product.entity';
export class CreateProductDto {
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
