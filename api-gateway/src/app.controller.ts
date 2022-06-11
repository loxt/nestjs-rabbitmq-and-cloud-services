import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
import { UpdateCategoryDto } from './dtos/update-category.dto';

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

  @Put('categories/:id')
  updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id') id: string,
  ): void {
    this.clientAdminBackend.emit('update-category', {
      id,
      category: updateCategoryDto,
    });
  }
}
