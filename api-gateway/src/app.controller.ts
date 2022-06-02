import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
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
  private logger: Logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:QtJFBU8LdY2P@3.95.238.78/smartranking'],
      queue: 'admin-backend',
    },
  });
  constructor(private readonly appService: AppService) {}

  @Post('categories')
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Observable<any> {
    return this.clientAdminBackend.emit('create-category', createCategoryDto);
  }
}
