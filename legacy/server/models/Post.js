const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

postSchema.virtual('id').get(function() {
  // Return _id as a string
  return this._id.toString();
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });



module.exports = mongoose.model('Post', postSchema);
