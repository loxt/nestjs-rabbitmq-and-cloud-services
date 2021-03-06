import { Schema } from 'mongoose';

export const ChallengeModel = new Schema(
  {
    date: Date,
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
    players: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    },
    match: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
    },
    category: String,
    status: String,
  },
  {
    timestamps: true,
    collection: 'challenges',
  },
);
