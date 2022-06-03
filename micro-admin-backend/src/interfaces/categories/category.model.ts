import { Schema } from 'mongoose';

export const CategoryModel = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: String,
    events: [
      {
        name: String,
        operation: String,
        value: Number,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'categories',
  },
);
