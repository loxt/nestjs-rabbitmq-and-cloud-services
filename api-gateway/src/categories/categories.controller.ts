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
import { Observable } from 'rxjs';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Controller('api/v1')
@UsePipes(ValidationPipe)
export class CategoriesController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

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
