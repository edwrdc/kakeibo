"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "@/lib/genericModalUtils";
import { cn } from "@/lib/utils";
import { FaChartLine } from "react-icons/fa";

interface ICreateInvestmentButtonProps {
  className?: string;
}

const CreateInvestmentButton = ({ className }: ICreateInvestmentButtonProps) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={cn(
        "font-semibold text-md mt-3 flex items-center gap-[14px]",
        className
      )}
      data-testid="create-investment-button"
      onClick={() => openGenericModal("Investments", dispatch)}
    >
      <FaChartLine size={18} />
      Create an investment
    </Button>
  );
};
export default CreateInvestmentButton;
