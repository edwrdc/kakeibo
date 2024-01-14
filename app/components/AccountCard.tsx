import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import { SerializedUserAccount } from "../redux/features/userAccountSlice";
import ActionPopover from "@/components/ActionPopover";
import { useAppDispatch } from "../redux/hooks";
import { openGenericModal } from "../redux/features/genericModalSlice";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { cn } from "@/lib/utils";
import { deleteGeneric } from "@/actions/generic";
import { UserAccount } from "@prisma/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface IAccountCardProps {
  account: SerializedUserAccount;
  className?: string;
}

const AccountCard = ({ account, className }: IAccountCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const accountCategory = CreateUserAccountOptions[account.category];

  const handleActionCallback = (
    result: Awaited<ReturnType<typeof deleteGeneric>>,
    cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
  ) => {
    if (result?.error) {
      showErrorToast("An error occurred.", result.error as string);
    } else {
      router.refresh();
      showSuccessToast(
        "Account deleted.",
        "Selected account has been deleted."
      );
      dispatch(cleanUp());
    }
  };

  const handleDeleteAccount = (id: string) => {
    dispatch(
      showGenericConfirm({
        title: "Delete Account",
        message: "Are you sure you want to delete this account?",
        primaryActionLabel: "Delete",
        primaryAction: async () =>
          await deleteGeneric<UserAccount>({
            tableName: "userAccount",
            whereCondition: { id },
          }),
        resolveCallback: handleActionCallback,
      })
    );
  };

  return (
    <motion.div
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layoutId={`account-card-${account.id}`}
      className={cn(
        "p-4 rounded-md shadow-lg border w-full cursor-pointer relative",
        className
      )}
    >
      <ActionPopover
        popoverHeading={"Account Actions"}
        onEditActionClick={() => {
          dispatch(
            openGenericModal({
              mode: "edit",
              key: "account",
              dialogTitle: "Edit an account",
              dialogDescription: "Fill out the form below to edit an account.",
              entityId: account.id,
            })
          );
        }}
        onDeleteActionClick={() => handleDeleteAccount(account.id)}
      />
      <p className="font-semibold mb-2 text-primary">
        {account.name}{" "}
        <span className="dark:text-white/60 text-foreground">
          ({accountCategory})
        </span>
      </p>
      <p className="text-md">Balance: RM {account.balance}</p>
    </motion.div>
  );
};
export default AccountCard;
