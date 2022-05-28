import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryAlreadyExists = await this.findOne(createCategoryDto.name);

    if (categoryAlreadyExists) {
      throw new BadRequestException(
        `Category with name ${createCategoryDto.name} already exists`,
      );
    }

    const createdCategory = await this.categoryModel.create(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().populate('players').exec();
  }

  async findOne(name: string): Promise<Category> {
    const foundedCategory = await this.categoryModel
      .findOne({ name })
      .populate('players')
      .exec();

    if (!foundedCategory) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }
    return foundedCategory;
  }

  async update(name: string, updateCategoryDto: UpdateCategoryDto) {
    const foundedCategory = await this.categoryModel
      .findOneAndUpdate({ name }, updateCategoryDto, { new: true })
      .exec();

    if (!foundedCategory) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }
    return foundedCategory;
  }

  async addPlayerToCategory(name: string, playerId: string) {
    const foundedCategory = await this.findOne(name);

    if (!foundedCategory) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }

    foundedCategory.players.push(playerId as any);

    await this.categoryModel
      .findOneAndUpdate({ name }, { $set: foundedCategory })
      .exec();
    return foundedCategory;
  }
}
