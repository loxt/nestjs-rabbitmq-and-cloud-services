import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Observable } from 'rxjs';

@Controller('api/v1')
@UsePipes(ValidationPipe)
export class AppController {
  private clientAdminBackend: ClientProxy = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:QtJFBU8LdY2P@3.95.238.78/smartranking'],
      queue: 'admin-backend',
    },
  });

  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto): void {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get('categories')
  findCategories(@Query('id') id = ''): Observable<any> {
    return this.clientAdminBackend.send('find-categories', id);
  }
}
