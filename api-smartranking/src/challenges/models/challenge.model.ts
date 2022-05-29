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
    category: String,
    status: String,
  },
  {
    timestamps: true,
    collection: 'challenges',
  },
);
