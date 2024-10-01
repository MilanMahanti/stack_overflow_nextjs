import { z } from "zod";

export const QuestionFromSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z
    .string()
    .min(20, "Question explanation should be at least 20 characters long."),
  tags: z
    .array(z.string().min(1).max(15))
    .min(1, "There should at least be one tag.")
    .max(5, "There should not be more than 5 tags."),
});

export const AnswerFromSchema = z.object({
  answer: z.string().min(20),
});

export const ProfileFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(30, { message: "Name cannot be longer than 30 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(15, { message: "Username cannot be longer than 15 characters" }),
  portfolio: z
    .string()
    .url({ message: "Portfolio must be a valid URL" })
    .optional(),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters long" })
    .max(30, { message: "Address cannot be longer than 30 characters" }),
  bio: z
    .string()
    .min(5, { message: "Bio must be at least 5 characters long" })
    .max(200, { message: "Bio cannot be longer than 200 characters" }),
});
