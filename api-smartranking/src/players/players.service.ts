import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger: Logger = new Logger('PlayersService');

  createPlayer(createPlayerDto: CreatePlayerDto): Player {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);

    const { phoneNumber, email, name } = createPlayerDto;

    return {
      _id: uuid(),
      phoneNumber,
      email,
      name,
      photoUrl: 'photo.url',
      ranking: 'A',
      rankingPosition: 1,
    };
  }
}
