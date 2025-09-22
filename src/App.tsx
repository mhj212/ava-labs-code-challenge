import React, { useState } from "react";
import From from "./components/sections/From";
import Asset from "./components/sections/Asset";
import To from "./components/sections/To";
import Amount from "./components/sections/Amount";
import Memo from "./components/sections/Memo";
import Stepper from "./components/sections/Stepper";
import { Button } from "../src/components/ui/Button";

import TransactionSuccess from './components/pages/TransactionSuccess';
// Define type for the step names, matching Stepper and child components
type Step = "asset" | "from" | "to" | "amount" | "memo";

export default function App() {
  const [stepperActive, setStepperActive] = useState<Step | "">("");
  const [togglePage, setTogglePage] = useState<boolean>(false);
  const handleStepperFromChild = (value: Step) => {
    setStepperActive(value);
  };

  return (
    <div id="main" className="bg-[#f9f7f6] w-full p-2.5">
      {!togglePage &&
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: 600 }}>Transfer</h1>
          <Stepper active={stepperActive} />

          <div id="container" className="w-[826px] px-5 mx-auto flex flex-col gap-4">
            <Asset onSendToStepper={handleStepperFromChild} />
            <From onSendToStepper={handleStepperFromChild} />
            <To onSendToStepper={handleStepperFromChild} />
            <Amount onSendToStepper={handleStepperFromChild} />
            <Memo onSendToStepper={handleStepperFromChild} />

            <div className="flex justify-end gap-2">
              <Button className="w-[114px] h-[40px] rounded-[9px] p-[12px_20px] bg-[#6881994D]">Start Over</Button>
              <Button className="w-[156px] h-[40px] rounded-[9px] py-[12px] px-[20px] bg-[#E2C889] ml-2" onClick={() => setTogglePage(!togglePage)}>Review Transfer</Button>
            </div>
          </div>
        </div>}
      {togglePage && <TransactionSuccess setTogglePage={setTogglePage} />}
    </div>
  );
}
