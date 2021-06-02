import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { BaseController } from '../shared/class/base.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController extends BaseController {
  constructor(private readonly clientsService: ClientsService) {
    super();
  }

  @Post()
  @ApiBody({ type: CreateClientDto })
  async create(@Body() createClientDto: CreateClientDto) {
    try {
      const data = await this.clientsService.create(createClientDto);

      return this.sucessResponse(data, 'Created!');
    } catch (err) {
      return this.errorResponse(err);
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.clientsService.findAll();

      return this.sucessResponse(data);
    } catch (err) {
      return this.errorResponse(err);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.clientsService.findOne(+id);

    return this.sucessResponse(data);
  }

  @Put(':id')
  @ApiBody({ type: UpdateClientDto })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    try {
      const data = await this.clientsService.update(+id, updateClientDto);

      return this.sucessResponse(data, 'Updated!');
    } catch (err) {
      return this.errorResponse(err);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.clientsService.remove(+id);

      return this.sucessResponse(data, 'Deleted!');
    } catch (err) {
      return this.errorResponse(err);
    }
  }
}
