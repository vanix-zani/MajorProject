import mongoose, { Schema, type Document, type Model } from "mongoose"

interface IOption {
  text: string
  isCorrect: boolean
}

export interface IQuestion {
  text: string
  options: IOption[]
}

export interface IQuiz extends Document {
  title: string
  topic: mongoose.Types.ObjectId
  description: string
  questions: IQuestion[]
  timeLimit?: number // in minutes
  createdAt: Date
  updatedAt: Date
}

const OptionSchema = new Schema<IOption>({
  text: {
    type: String,
    required: [true, "Please provide option text"],
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
})

const QuestionSchema = new Schema<IQuestion>({
  text: {
    type: String,
    required: [true, "Please provide question text"],
  },
  options: {
    type: [OptionSchema],
    required: [true, "Please provide options"],
    validate: {
      validator: (options: IOption[]) => options.length >= 2 && options.some((option) => option.isCorrect),
      message: "At least 2 options are required and one must be correct",
    },
  },
})

const QuizSchema = new Schema<IQuiz>(
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
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    questions: {
      type: [QuestionSchema],
      required: [true, "Please provide questions"],
      validate: {
        validator: (questions: IQuestion[]) => questions.length > 0,
        message: "At least one question is required",
      },
    },
    timeLimit: {
      type: Number,
      min: 1,
    },
  },
  { timestamps: true },
)

// Check if model exists before creating a new one
const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema)

export default Quiz as Model<IQuiz>
