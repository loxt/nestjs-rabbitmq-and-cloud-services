import { Document } from 'mongoose';
import { Player } from '../../players/interfaces/player.interface';

export interface Category extends Document {
  readonly name: string;
  description: string;
  events: Event[];
  jogadores: Player[];
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
