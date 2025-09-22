import { z } from "zod";

const stepSchema = z.enum(["asset", "from", "to", "amount", "memo"]);
type Step = z.infer<typeof stepSchema>;

interface StepperProps {
  active: string;
}

export default function Stepper({ active }: StepperProps) {
  // Validate active step
  const result = stepSchema.safeParse(active);
  const validatedActive: Step | undefined = result.success ? active : undefined;

  const steps: Step[] = ["asset", "from", "to", "amount", "memo"];

  return (
    <div className="flex flex-col gap-3 absolute mt-2">
      {steps.map((step) => (
        <div
          key={step}
          className={
            validatedActive === step
              ? "w-[5px] h-[40px] bg-[#3470AB] rounded-[5px]"
              : "w-[5px] h-[5px] bg-[#6881994D] rounded-[5px]"
          }
        ></div>
      ))}
    </div>
  );
}
