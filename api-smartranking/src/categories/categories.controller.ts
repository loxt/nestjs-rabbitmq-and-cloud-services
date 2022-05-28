import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interfaces/category.interface';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/v1/categories')
@UsePipes(ValidationPipe)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get('/:name')
  async findOne(@Param('name') name: string): Promise<Category> {
    return this.categoriesService.findOne(name);
  }

  @Put('/:name')
  async update(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('name') name: string,
  ): Promise<Category> {
    return this.categoriesService.update(name, updateCategoryDto);
  }

  @Post('/:name/players/:playerId')
  async addPlayerToCategory(
    @Param('name') name: string,
    @Param('playerId') playerId: string,
  ): Promise<Category> {
    return this.categoriesService.addPlayerToCategory(name, playerId);
  }
}
