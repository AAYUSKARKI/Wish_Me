import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  media: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  category: {
    type: Array,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
},
  {
    timestamps: true,
  });

export const Post = mongoose.model('Post', postSchema);
