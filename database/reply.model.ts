import { Schema, Document, model, models } from "mongoose";

export interface IReply extends Document {
  answer: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  comment: string;
  createdAt: Date;
}
const replySchema = new Schema<IReply>({
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const reply = models.Reply || model("Reply", replySchema);

export default reply;
