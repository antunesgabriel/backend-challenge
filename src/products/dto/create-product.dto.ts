export class CreateProductDto {
  name: string;

  code: string;

  fabrication: 'National' | 'Imported';

  size: number;

  value: number;
}
