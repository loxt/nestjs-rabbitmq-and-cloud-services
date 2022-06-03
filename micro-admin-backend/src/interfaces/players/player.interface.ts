import { Document } from 'mongoose';
import { Category } from '../categories/category.interface';

export interface Player extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  name: string;
  ranking: string;
  category: Category;
  rankingPosition: number;
  photoUrl: string;
}
