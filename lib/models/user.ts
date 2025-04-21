import mongoose, { Schema, type Document, type Model } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  class: number
  role: "student" | "admin"
  createdAt: Date
  updatedAt: Date
  comparePassword: (candidatePassword: string) => Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    class: {
      type: Number,
      required: [true, "Please provide a class"],
      min: 6,
      max: 12,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Check if model exists before creating a new one
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User as Model<IUser>
