import { Schema, model, models, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IAnswer extends Document {
  question: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  answer: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}
// 2. Create a Schema corresponding to the document interface.
const answerSchema = new Schema<IAnswer>({
  question: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  ],
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 3. Create a Model.
const Answer = models.Answer || model("Question", answerSchema);
export default Answer;
