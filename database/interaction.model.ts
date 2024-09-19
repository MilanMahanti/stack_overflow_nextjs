import { Schema, Document, model, models } from "mongoose";

export interface IInteraction extends Document {
  question: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  action: string;
  createdAt: Date;
}

const interactionSchema = new Schema<IInteraction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
  },
  action: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Interaction =
  models.Interaction || model("Interaction", interactionSchema);

export default Interaction;
