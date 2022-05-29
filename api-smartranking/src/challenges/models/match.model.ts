import { Schema } from 'mongoose';

export const MatchModel = new Schema(
  {
    category: String,
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
    players: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    },
    result: [
      {
        set: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'matchs',
  },
);
