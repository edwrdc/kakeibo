"use client";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/app/redux/hooks";
import ActionPopover from "@/components/ActionPopover";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { SerializedDebt } from "@/app/redux/features/debtSlice";
import { deleteGeneric } from "@/actions/generic";
import { Debt } from "@prisma/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

interface IDebtCardProps {
  debt: SerializedDebt;
}

const DebtCard = ({ debt }: IDebtCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDeleteDebt = (id: string) => {
    const handleActionCallback = (
      result: Awaited<ReturnType<typeof deleteGeneric>>,
      cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
    ) => {
      if (result?.error) {
        showErrorToast("An error occurred.", result.error as string);
      } else {
        router.refresh(); 
        showSuccessToast("Debt deleted.", "Selected debt has been deleted.");
        dispatch(cleanUp());
      }
    };

    dispatch(
      showGenericConfirm({
        title: "Delete Debt",
        message: "Are you sure you want to delete this debt?",
        primaryActionLabel: "Delete",
        primaryAction: async () =>
          await deleteGeneric<Debt>({
            tableName: "debt",
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
      layoutId={`debt-card-${debt.id}`}
      className="flex flex-col gap-2 p-4 pt-6 border-1 shadow-xl rounded-md relative bg-card border cursor-pointer"
      key={debt.id}
    >
      <p className="font-semibold dark:text-white/60 text-foreground">
        Due: {debt.dueDate.toLocaleDateString()} {/* Updated to convert Date object to string */}
      </p>
      <div className="absolute top-3 right-1 mb-2">
        <div className="flex items-center">
          <ActionPopover
            popoverHeading={"Debt Actions"}
            isAbsolute={false}
            onEditActionClick={() =>
              dispatch(
                openGenericModal({
                  dialogDescription:
                    "Edit your debt information by using the form below.",
                  dialogTitle: "Edit Debt",
                  mode: "edit",
                  key: "debt", // This key is valid based on file_context_1
                  entityId: debt.id,
                })
              )
            }
            placementClasses="top-0 right-0 mb-0"
            onDeleteActionClick={() => handleDeleteDebt(debt.id)}
          />
          <Badge className="ml-auto">
            {debt.debtAmount.toFixed(2)} {/* Updated property based on schema.prisma */}
          </Badge>
        </div>
      </div>
      <p className="mt-4 text-md dark:text-white/60 text-foreground">
        Amount: {debt.debtAmount.toFixed(2)} {/* Updated property based on schema.prisma */}
      </p>
    </motion.div>
  );
};

export default DebtCard;
