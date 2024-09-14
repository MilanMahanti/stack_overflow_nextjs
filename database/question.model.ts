import { Schema, model, models, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IQuestion extends Document {
  title: string;
  explanation: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  answers: Schema.Types.ObjectId[];
  createdAt: Date;
}
// 2. Create a Schema corresponding to the document interface.
const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 3. Create a Model.
const Question = models.Question || model("Question", questionSchema);
export default Question;
