import React, { useState } from "react";
import { z } from "zod";

// Zod schema for memo: allow any characters
const memoSchema = z
  .string()
  .min(1, "Memo cannot be empty")
  .max(200, "Memo cannot exceed 200 characters");

interface MemoProps {
  onSendToStepper: (step: string) => void;
}

export default function Memo({ onSendToStepper }: MemoProps) {
  const [text, setText] = useState<string>("Enter a memo");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const validateMemo = (value: string): boolean => {
    const result = memoSchema.safeParse(value);
    if (!result.success) {
      return false;
    }
    return true;
  };

  const handleBlur = () => {
    setIsEditing(false);
    validateMemo(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      validateMemo(text);
    }
  };

  const handleClickNextStep = () => {
    if (validateMemo(text)) {
      onSendToStepper("memo");
    }
  };

  return (
    <div
      id="memo-section"
      className="focus-within:shadow-[0_4px_20px_0_#6881994D] focus-within:backdrop-blur-[40px] hover:bg-white bg-gray-200 h-[80px] rounded-xl border border-gray-300 p-6 hover:bg-white focus-within:shadow-lg focus-within:backdrop-blur-[40px] flex items-center"
      onClick={handleClickNextStep}
    >
      <div className="font-semibold text-xl">Memo</div>
      <div className="ml-[142px] flex flex-col">
        {isEditing ? (
          <input
            type="text"
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ width: "530px" }}
          />
        ) : (
          <span
            className="cursor-pointer px-2 py-1 text-base font-medium"
            onClick={() => setIsEditing(true)}
          >
            {text || "Enter a memo"}
          </span>
        )}
      </div>
    </div>
  );
}
