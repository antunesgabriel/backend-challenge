import { EntityRepository, Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';

@EntityRepository(Client)
export class ClientsRepository extends Repository<Client> {
  async createClient(clientDto: CreateClientDto): Promise<Client> {
    const client = this.create(clientDto);

    return this.save(client);
  }
}
