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

  async findOne(email: string): Promise<Player> {
    const foundedPlayer = this.playerModel.findOne({ email }).exec();
    if (!foundedPlayer) {
      throw new NotFoundException(`Player with e-mail ${email} not found`);
    }
    return foundedPlayer;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = await this.playerModel.create(createPlayerDto);
    await createdPlayer.save();

    return createdPlayer;
  }

  async update(updatePlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerModel
      .findOneAndUpdate(
        { email: updatePlayerDto.email },
        {
          $set: updatePlayerDto,
        },
      )
      .exec();
  }

  async delete(email: string): Promise<any> {
    return this.playerModel.remove({ email }).exec();
  }
}
