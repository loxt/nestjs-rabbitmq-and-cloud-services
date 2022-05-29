import { IsNotEmpty } from 'class-validator';
import { Player } from '../../players/interfaces/player.interface';

export class AssignMatchToChallengeDto {
  @IsNotEmpty()
  winner: Player;
}
