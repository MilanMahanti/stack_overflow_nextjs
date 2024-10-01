"use client";

import React, { useRef, useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { AnswerFromSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { marked } from "marked";
import { ReloadIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

interface params {
  authorId: string;
  questionId: string;
  question: string;
}

const AnswerForm = ({ authorId, questionId, question }: params) => {
  const editorRef = useRef(null);
  const { mode } = useTheme();
  const [isSubmmitting, setIsSubmitting] = useState(false);
  const [isAiSubmmitting, setIsAiSubmitting] = useState(false);
  const path = usePathname();

  const form = useForm<z.infer<typeof AnswerFromSchema>>({
    resolver: zodResolver(AnswerFromSchema),
    defaultValues: {
      answer: "",
    },
  });
  const handelCreateAnswer = async (
    values: z.infer<typeof AnswerFromSchema>
  ) => {
    if (!authorId) return toast.error("Please login first ");
    setIsSubmitting(true);
    const toastId = toast.loading("Posting your answer...");
    try {
      await createAnswer({
        answer: values.answer,
        question: JSON.parse(questionId),
        author: JSON.parse(authorId),
        path,
      });
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
      toast.dismiss(toastId);
      toast.success("Answer posted successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAiAnswer = async () => {
    if (!authorId) return toast.error("Please login first ");

    setIsAiSubmitting(true);
    try {
      // Generate an answer using the Gemini Ai
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/gemini`,
        {
          method: "POST",
          body: JSON.stringify(question),
        }
      );
      const aiAnswer = await res.json();
      if (editorRef) {
        const editor = editorRef.current as any;
        editor.setContent(marked.parse(aiAnswer));
      }
    } catch (error) {
      toast.error("There was a problem generating answer");
    } finally {
      setIsAiSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
          <span className="text-primary-500">*</span>
        </h4>
        <Button
          className={`hover:shadow-glow ai-button relative flex items-center gap-1.5 rounded-md px-4 py-2.5 
            text-primary-500 shadow-none transition-transform duration-300 ease-in-out
            hover:scale-105 dark:text-primary-500 ${isAiSubmmitting ? "cursor-wait" : "cursor-pointer"}`}
          onClick={() => generateAiAnswer()}
          disabled={isAiSubmmitting}
        >
          <Image
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className={`object-contain ease-linear ${
              isAiSubmmitting ? "animate-pulse" : ""
            }`}
          />
          {isAiSubmmitting ? "Generating..." : "Generate an AI answer"}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handelCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                    //  @ts-ignore
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={(content: any) => {
                      field.onChange(content);
                    }}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "codesample",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular text-light-500">
                  Introduce the answer and expand on what you put in the title.
                  Minimum 20 characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit !text-light-900"
              disabled={isSubmmitting}
            >
              {isSubmmitting && (
                <ReloadIcon className="mr-2 size-4 animate-spin text-light-900" />
              )}

              {isSubmmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
