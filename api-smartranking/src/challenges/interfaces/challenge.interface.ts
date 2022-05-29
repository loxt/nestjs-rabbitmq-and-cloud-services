import { Player } from '../../players/interfaces/player.interface';

export interface Challenge extends Document {
  date: Date;
  requester: Player;
  players: Player[];
  category: string;
}
