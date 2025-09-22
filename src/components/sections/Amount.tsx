import { Input } from "../../components/ui/Input";
import { Button } from "../ui/Button";
import React, { useState } from "react";
import usdtImage from "../../img/usdt-img.png";

interface AmountProps {
  onSendToStepper: (step: string) => void;
}

/** Normalize user typing but allow starting dot */
function normalizeInput(input: string): string {
  if (!input) return "";

  let s = input.replace(/\s+/g, "").replace(/,/g, "");
  s = s.replace(/[^0-9.]/g, "");

  const firstDot = s.indexOf(".");
  if (firstDot >= 0) {
    const intPart = s.slice(0, firstDot);
    const fracPart = s.slice(firstDot + 1).replace(/\./g, "");
    s = intPart + "." + fracPart;
  }

  let [intPart, fracPart] = s.split(".");

  if (intPart === "") intPart = "";
  if (intPart.length > 1) intPart = intPart.replace(/^0+/, "") || "0";

  return fracPart !== undefined ? `${intPart}.${fracPart}` : intPart;
}

/** Format normalized string for display */
function formatForDisplay(normalized: string): string {
  if (!normalized) return "";

  let [intPart, fracPart] = normalized.split(".");
  intPart = intPart.replace(/^0+/, "") || "0";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (fracPart) fracPart = fracPart.replace(/0+$/, "");

  return fracPart ? `${intPart}.${fracPart}` : intPart;
}

export default function Amount({ onSendToStepper }: AmountProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [maxDisabled, setMaxDisabled] = useState<boolean>(false);
  const [feeMessage, setFeeMessage] = useState<string>("0.0017 AVAX");
  const [balanceMessage, setBalanceMessage] = useState<string>(
    "$ 376,244.00 ≈ 10,000,000 AVAX"
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorFeeMessage, setErrorFeeMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typed = e.target.value;
    const normalized = normalizeInput(typed);
    setInputValue(normalized);
    setMaxDisabled(false);
  };

  const handleBlur = () => {
    const normalized = inputValue === "." ? "0" : normalizeInput(inputValue);
    setInputValue(formatForDisplay(normalized));
  };

  const handleFocus = () => {
    setInputValue(normalizeInput(inputValue));
  };

  const handleMaxClick = () => {
    setMaxDisabled(true);
    const maxVal = normalizeInput("5430420.99");
    setInputValue(formatForDisplay(maxVal));
  };

  return (
    <div
      id="amount-section"
      className="focus-within:shadow-[0_4px_20px_0_#6881994D] focus-within:backdrop-blur-[40px] hover:bg-white bg-gray-200 rounded-xl border border-gray-300 py-4 px-6 hover:bg-white focus-within:shadow-lg focus-within:backdrop-blur-[40px]"
      onClick={() => onSendToStepper("amount")}
    >
      {/* Top Row */}
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-xl">Amount</div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            {/* Keep Input style inline */}
            <Input
              style={{ height: "40px", width: "425px" }}
              placeholder="0.00"
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
            
          </div>

          {/* Keep MAX button inline styles */}
          <div className="relative">
            <Button
              disabled={maxDisabled}
              className="disabled:bg-[#ccc] disabled:text-[#666] disabled:cursor-not-allowed disabled:opacity-70 hover:text-black hover:opacity-80 hover:cursor-pointer"
              onClick={handleMaxClick}
              // tailwind padding was off, so using style tag
              style={{ padding: "12px 20px", backgroundColor: "#6881994D" }}
            >
              MAX
            </Button>
            {maxDisabled && (
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white text-blue-600 shadow-md px-4 py-2 rounded text-xs whitespace-nowrap">
                You’ve already entered the maximum amount available for
                <br />
                the selected source.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Available */}
      <div className="flex justify-between ml-[210px] mt-0.5 text-xs text-gray-400">
        <div>
          {balanceMessage && <span className="text-gray-400">Available &nbsp;&nbsp;&nbsp;&nbsp;{balanceMessage}</span>}
          {errorMessage && <div className="text-[#E1856B] mt-[5px]">{errorMessage}</div>}
        </div>
        <button
          className="text-blue-700 underline hover:no-underline"
        >
        </button>
      </div>

      {/* Divider */}
      <hr className="my-2 border-gray-300" />

      {/* Fee row */}
      <div className="flex items-center">
        <span className="text-base font-semibold">Fee</span>
        {feeMessage && <span className="text-base text-gray-500 ml-[183px]">{feeMessage}</span>}
        {errorFeeMessage && <div className="text-[#E1856B] ml-[183px]">{errorFeeMessage}</div>}
      </div>
    </div>
  );
}
