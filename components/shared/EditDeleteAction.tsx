"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/questions.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
interface props {
  type: string;
  productId: string;
}
const EditDeleteAction = ({ type, productId }: props) => {
  const path = usePathname();
  const router = useRouter();
  const handelClick = () => {
    router.push(`/edit-question/${JSON.parse(productId)}`);
  };
  const handelDelete = async () => {
    if (type === "question") {
      // delete question
      await deleteQuestion({ questionId: JSON.parse(productId), path });
    } else if (type === "answer") {
      // delete answer
      await deleteAnswer({ answerId: JSON.parse(productId), path });
    }
  };
  return (
    <div className="flex shrink-0 items-center justify-end gap-3 max-sm:w-full">
      {type === "question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handelClick}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handelDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
