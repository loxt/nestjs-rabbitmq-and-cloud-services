import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger: Logger = new Logger('PlayersService');

  create(createPlayerDto: CreatePlayerDto): Player {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);

    const { phoneNumber, email, name } = createPlayerDto;

    const newPlayer: Player = {
      _id: uuid(),
      phoneNumber,
      email,
      name,
      photoUrl: 'photo.url',
      ranking: 'A',
      rankingPosition: 1,
    };

    this.players.push(newPlayer);

    return newPlayer;
  }

  update(updatePlayerDto: CreatePlayerDto): Player {
    this.logger.log(`updatePlayerDto: ${JSON.stringify(updatePlayerDto)}`);

    const foundedPlayer = this.players.find(
      (player) => player.email === updatePlayerDto.email,
    );
    if (foundedPlayer) {
      Object.assign(foundedPlayer, updatePlayerDto);
      this.players[this.players.indexOf(foundedPlayer)] = foundedPlayer;
    }

    return foundedPlayer;
  }

  findAll(): Player[] {
    return this.players;
  }

  findOne(email: string): Player {
    const foundedPlayer = this.players.find((player) => player.email === email);
    if (!foundedPlayer) {
      throw new NotFoundException(`Player with e-mail ${email} not found`);
    }
    return foundedPlayer;
  }
}
