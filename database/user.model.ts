import { Document, model, models, Schema } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  userName: string;
  email: string;
  password?: string;
  profilePhoto: string;
  address?: string;
  portfolio?: string;
  joiningDate: Date;
  bio?: string;
  questions: Schema.Types.ObjectId[];
  answers: number;
  saved: Schema.Types.ObjectId[];
  reputation?: number;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true, // Ensures unique usernames
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique email
    trim: true,
  },
  password: { type: String },
  profilePhoto: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  portfolio: {
    type: String,
    default: null, // Optional field, default to null if not provided
  },
  joiningDate: {
    type: Date,
    default: Date.now, // Automatically sets to the current date
  },
  bio: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  answers: {
    type: Number,
    default: 0,
  },
  reputation: {
    type: Number,
    default: 0,
  },
  saved: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

// 3. Create the User model using Mongoose.
const User = models.User || model<IUser>("User", userSchema);

export default User;
