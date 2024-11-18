import mongoose from 'mongoose'

const { model, Schema } = mongoose

const blogSchema = new Schema(
  {
    title: {
      type: 'String',
      required: true,
      trim: true,
    },
    content: {
      type: 'String',
      required: true,
    },
    image: {
      type: 'String',
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

export const Blog = model('Blog', blogSchema)
