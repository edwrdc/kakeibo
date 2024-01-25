"use client";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/app/redux/hooks";
import ActionPopover from "@/components/ActionPopover";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { SerializedInvestment } from "@/app/redux/features/investmentSlice";
import { deleteGeneric } from "@/actions/generic";
import { Investment } from "@prisma/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

interface IInvestmentCardProps {
  investment: SerializedInvestment;
}

const InvestmentCard = ({ investment }: IInvestmentCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDeleteInvestment = (id: string) => {
    const handleActionCallback = (
      result: Awaited<ReturnType<typeof deleteGeneric>>,
      cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
    ) => {
      if (result?.error) {
        showErrorToast("An error occurred.", result.error as string);
      } else {
        router.refresh(); 
        showSuccessToast("Investment deleted.", "Selected investment has been deleted.");
        dispatch(cleanUp());
      }
    };

    dispatch(
      showGenericConfirm({
        title: "Delete Investment",
        message: "Are you sure you want to delete this investment?",
        primaryActionLabel: "Delete",
        primaryAction: async () =>
          await deleteGeneric<Investment>({
            tableName: "investment",
            whereCondition: { id },
          }),
        resolveCallback: handleActionCallback,
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 20 }}
      layoutId={`investment-card-${investment.id}`}
      className="flex flex-col gap-2 p-4 pt-6 border-1 shadow-xl rounded-md relative bg-card border cursor-pointer"
      key={investment.id}
    >
      <p className="font-semibold dark:text-white/60 text-foreground">
        {investment.name}
      </p>
      <p className="text-sm text-gray-500">
        Type: {investment.investmentType}
      </p>
      <p className="text-sm text-gray-500">
        Investment Start Date: {investment.startDate.toDateString()}
      </p>
      <p className="text-sm text-gray-500">
        Maturity Data: {investment.maturityDate.toDateString()}
      </p>
      <div className="absolute top-3 right-1 mb-2">
        <div className="flex items-center">
          <ActionPopover
            popoverHeading={"Investment Actions"}
            isAbsolute={false}
            onEditActionClick={() =>
              dispatch(
                openGenericModal({
                  dialogDescription:
                    "Edit your investment information by using the form below.",
                  dialogTitle: "Edit Investment",
                  mode: "edit",
                  key: "investment",
                  entityId: investment.id,
                })
              )
            }
            placementClasses="top-0 right-0 mb-0"
            onDeleteActionClick={() => handleDeleteInvestment(investment.id)}
          />
          <Badge className="ml-auto">
            {investment.amount.toFixed(2)}
          </Badge>
        </div>
      </div>
      <p className="mt-4 text-md dark:text-white/60 text-foreground">
        Amount: {investment.amount.toFixed(2)}
      </p>
    </motion.div>
  );
};

export default InvestmentCard;
