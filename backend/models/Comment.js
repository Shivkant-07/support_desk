import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Comment message cannot be empty'],
      trim: true,
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        path: String,
        mimetype: String,
        size: Number,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ ticketId: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
