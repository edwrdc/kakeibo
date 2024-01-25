"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "@/lib/genericModalUtils";
import { cn } from "@/lib/utils";
import { FaMoneyBillWave } from "react-icons/fa";

interface ICreateDebtButtonProps {
  className?: string;
}

const CreateDebtButton = ({ className }: ICreateDebtButtonProps) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={cn(
        "font-semibold text-md mt-3 flex items-center gap-[14px]",
        className
      )}
      data-testid="create-debt-button"
      onClick={() => openGenericModal("Debts", dispatch)}
    >
      <FaMoneyBillWave size={18} />
      Create a debt
    </Button>
  );
};
export default CreateDebtButton;
