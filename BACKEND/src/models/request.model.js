import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  media: {
    type: String
  },
  community: 
  { type: Schema.Types.ObjectId, ref: 'Community'},
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  createdAt: {
    type: Date, default: Date.now
  },
  updatedAt: {
    type: Date, default: Date.now
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    text: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
},
  {
    timestamps: true
  });

export const Post = mongoose.model('Post', postSchema)