import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/client.entity';

import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  document: string;

  @ApiProperty({ enum: Gender, examples: ['Feminine', 'Masculine'] })
  gender: 'Feminine' | 'Masculine';

  @ApiProperty()
  email: string;
}
