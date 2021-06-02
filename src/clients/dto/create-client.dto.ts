export class CreateClientDto {
  name: string;
  code: string;
  document: string;
  gender: 'Feminine' | 'Masculine';
  email: string;
}
