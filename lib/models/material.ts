import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IMaterial extends Document {
  title: string
  topic: mongoose.Types.ObjectId
  type: "pdf" | "note" | "video"
  content: string
  url?: string
  createdAt: Date
  updatedAt: Date
}

const MaterialSchema = new Schema<IMaterial>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: [true, "Please provide a topic"],
    },
    type: {
      type: String,
      enum: ["pdf", "note", "video"],
      required: [true, "Please provide a material type"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    url: {
      type: String,
    },
  },
  { timestamps: true },
)

// Check if model exists before creating a new one
const Material = mongoose.models.Material || mongoose.model<IMaterial>("Material", MaterialSchema)

export default Material as Model<IMaterial>
