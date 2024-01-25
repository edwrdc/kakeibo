"use client";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchDebtById } from "@/app/redux/features/currentDebtSlide";
import FormLoadingSpinner from "../../FormLoadingSpinner";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import EditDebtSchema, { EditDebtSchemaType } from "@/schemas/EditDebtSchema";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { updateGeneric } from "@/actions/generic";
import { Debt } from "@prisma/client";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";

interface IEditUserDebtFormProps {
  entityId: string;
}

const EditUserDebtForm = ({ entityId }: IEditUserDebtFormProps) => {
  let [isPending, startTransition] = useTransition();
  const { currentDebt } = useAppSelector((state) => state.currentDebtReducer);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
    getValues,
  } = useForm<EditDebtSchemaType>({
    defaultValues: {
      name: "",
      debtAmount: 10000,
      currentAmount: 0,
      dueDate: "",
    },
    resolver: zodResolver(EditDebtSchema),
  });

  const hasMadeNoChanges = () => {
    const { name, debtAmount, currentAmount, dueDate } = getValues();
    return (
      name === currentDebt?.name &&
      debtAmount === currentDebt?.debtAmount &&
      currentAmount === currentDebt?.currentAmount &&
      dueDate === currentDebt?.dueDate.toISOString()
    );
  };

  useEffect(() => {
    if (entityId) {
      dispatch(fetchDebtById(entityId));
    }
  }, [dispatch, entityId]);

  useEffect(() => {
    if (currentDebt) {
      setValue("name", currentDebt.name);
      setValue("debtAmount", currentDebt.debtAmount);
      setValue("currentAmount", currentDebt.currentAmount);
      setValue("dueDate", currentDebt.dueDate.toISOString());
    }
  }, [currentDebt, setValue]);

  const onSubmit = async (data: EditDebtSchemaType) => {
    if (hasMadeNoChanges()) {
      return showDefaultToast(
        "No changes made.",
        "You haven't made any changes."
      );
    }

    let payload = {
      id: entityId,
      ...data,
      dueDate: new Date(data.dueDate),
    };

    startTransition(async () => {
      const result = await updateGeneric<Debt>({
        tableName: "debt",
        data: payload,
        whereCondition: {
          id: entityId,
        },
      });

      if (result?.error) {
        showErrorToast("An error occurred.", result.error as string);
      } else {
        router.refresh();
        showSuccessToast("Debt updated.", "Your debt has been updated.");
        dispatch(closeGenericModal());
      }
    });
  };

  if (!currentDebt) {
    return <FormLoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          name={"name"}
          label={"Debt Name"}
          placeholder={"Debt name"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"debtAmount"}
          label={"Debt Amount"}
          placeholder={"Debt amount"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"currentAmount"}
          label={"Current Amount"}
          placeholder={"Current amount"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <DatePicker
          name={"dueDate"}
          label={"Due Date"}
          placeholder={"Select a due date"}
          register={register}
          defaultValue={currentDebt?.dueDate.toISOString()}
          errors={errors}
          className="w-full"
          onChange={(value) => {
            setValue("dueDate", value);
          }}
        />
        <Button type="submit" disabled={isLoading || isSubmitting || isPending}>
          Update
        </Button>
      </div>
    </form>
  );
};

export default EditUserDebtForm;
