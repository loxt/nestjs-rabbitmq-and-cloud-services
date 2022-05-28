import { Schema } from 'mongoose';

export const PlayerModel = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    name: String,
    ranking: String,
    rankingPosition: Number,
    photoUrl: String,
  },
  {
    timestamps: true,
    collection: 'players',
  },
);
