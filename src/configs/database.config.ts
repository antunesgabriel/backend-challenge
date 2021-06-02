import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Product } from 'src/products/entities/product.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  synchronize: true,
  host: 'postgres',
  entities: [Client, Product],
};
