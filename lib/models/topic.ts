import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ITopic extends Document {
  name: string
  subject: mongoose.Types.ObjectId
  description: string
  createdAt: Date
  updatedAt: Date
}

const TopicSchema = new Schema<ITopic>(
  {
    name: {
      type: String,
      required: [true, "Please provide a topic name"],
      trim: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Please provide a subject"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
  },
  { timestamps: true },
)

// Check if model exists before creating a new one
const Topic = mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema)

export default Topic as Model<ITopic>
