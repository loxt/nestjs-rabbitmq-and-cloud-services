import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryAlreadyExists = await this.findByName(createCategoryDto.name);

    if (categoryAlreadyExists) {
      throw new BadRequestException(
        `Category with name ${createCategoryDto.name} already exists`,
      );
    }

    const createdCategory = await this.categoryModel.create(createCategoryDto);
    return createdCategory.save();
  }

  async findByName(name: string): Promise<Category> {
    return this.categoryModel.findOne({ name }).exec();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(name: string): Promise<Category> {
    const foundedCategory = await this.categoryModel.findOne({ name }).exec();

    if (!foundedCategory) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }
    return foundedCategory;
  }
}
