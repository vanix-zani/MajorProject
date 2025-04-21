import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ISubject extends Document {
  name: string
  class: number
  description: string
  createdAt: Date
  updatedAt: Date
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, "Please provide a subject name"],
      trim: true,
    },
    class: {
      type: Number,
      required: [true, "Please provide a class"],
      min: 6,
      max: 12,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
  },
  { timestamps: true },
)

// Check if model exists before creating a new one
const Subject = mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema)

export default Subject as Model<ISubject>
