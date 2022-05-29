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
import { PlayersService } from '../players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playerService: PlayersService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryAlreadyExists = await this.categoryModel
      .findOne({ name: createCategoryDto.name })
      .exec();

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

  async findPlayerCategory(playerId: string): Promise<Category> {
    const foundedCategory = await this.categoryModel
      .findOne()
      .where('players')
      .in([playerId])
      .populate('players')
      .exec();

    if (!foundedCategory) {
      throw new BadRequestException(
        `Player with id ${playerId} is'nt in a category.`,
      );
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

  async addPlayerToCategory(name: string, playerId: string): Promise<Category> {
    const foundedCategory = await this.findOne(name);

    if (!foundedCategory) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }

    await this.playerService.findOne(playerId);

    const playerAlreadyInCategory = await this.categoryModel
      .find({ name })
      .where('players')
      .in([playerId])
      .exec();

    if (playerAlreadyInCategory.length > 0) {
      throw new BadRequestException(
        `Player with id ${playerId} already in category ${name}`,
      );
    }

    foundedCategory.players.push(playerId as any);

    return this.categoryModel
      .findOneAndUpdate({ name }, { $set: foundedCategory }, { new: true })
      .populate('players')
      .exec();
  }
}
