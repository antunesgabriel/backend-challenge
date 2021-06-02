import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/client.entity';

export class CreateClientDto {
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
