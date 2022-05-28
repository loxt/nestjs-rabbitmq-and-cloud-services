import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async findOne(id: string): Promise<Player> {
    const foundedPlayer = this.playerModel.findOne({ _id: id }).exec();
    if (!foundedPlayer) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
    return foundedPlayer;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = await this.playerModel.create(createPlayerDto);
    await createdPlayer.save();

    return createdPlayer;
  }

  async update(id: string, updatePlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: updatePlayerDto,
        },
      )
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.playerModel.remove({ _id: id }).exec();
  }
}
