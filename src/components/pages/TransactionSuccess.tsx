// TransactionSuccess.tsx
import React from "react";
import { Button } from "../../../src/components/ui/Button";

interface TransactionSuccessProps {
  setTogglePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ setTogglePage }) => {
  return (
    <div
      id="success-container"
      className="flex flex-col justify-center items-center bg-[#f9f7f6] min-h-screen"
    >
      <div className="leading-[1.25] font-[Inter Tight] font-semibold text-[40px] text-center">
        Transaction <br />
        Successfully Created!
      </div>
      <div className="leading-[1.25] w-[394px] mt-2 font-medium text-[16px] text-center text-[#90A0AF]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
        Pellentesque et pharetra lectus, ut rhoncus velit.
      </div>
      <div className="mt-2 flex gap-2">
        <Button className="w-[217.5px] text-[16px] font-semibold cursor-pointer h-[45px] rounded-[9px] p-[12px_20px] bg-[#6881994D]">
          View Transaction
        </Button>
        <Button
          className="w-[217.5px] text-[16px] font-semibold cursor-pointer h-[45px] rounded-[9px] p-[12px_20px] bg-[#E2C889]"
          onClick={() => setTogglePage(false)}
        >
          New Request
        </Button>
      </div>
    </div>
  );
};

export default TransactionSuccess;
