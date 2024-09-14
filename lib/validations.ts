import { z } from "zod";

export const QuestionFromSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(50),
  tags: z
    .array(z.string().min(1).max(15))
    .min(1)
    .max(5, "There should not be more than 5 tags."),
});
