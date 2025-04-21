import mongoose, { Schema, type Document, type Model } from "mongoose"

interface IAnswer {
  question: string
  selectedOption: string
  isCorrect: boolean
}

export interface IQuizResult extends Document {
  user: mongoose.Types.ObjectId
  quiz: mongoose.Types.ObjectId
  score: number
  totalQuestions: number
  answers: IAnswer[]
  timeTaken?: number // in seconds
  createdAt: Date
  updatedAt: Date
}

const AnswerSchema = new Schema<IAnswer>({
  question: {
    type: String,
    required: [true, "Please provide question text"],
  },
  selectedOption: {
    type: String,
    required: [true, "Please provide selected option"],
  },
  isCorrect: {
    type: Boolean,
    required: [true, "Please provide correctness status"],
  },
})

const QuizResultSchema = new Schema<IQuizResult>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Please provide a quiz"],
    },
    score: {
      type: Number,
      required: [true, "Please provide a score"],
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: [true, "Please provide total questions"],
      min: 1,
    },
    answers: {
      type: [AnswerSchema],
      required: [true, "Please provide answers"],
    },
    timeTaken: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true },
)

// Check if model exists before creating a new one
const QuizResult = mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", QuizResultSchema)

export default QuizResult as Model<IQuizResult>
