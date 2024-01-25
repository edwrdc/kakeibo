"use client";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux/hooks";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateDebtSchema, {
  CreateDebtSchemaType,
} from "@/schemas/CreateDebtSchema";
import FormInput from "@/components/FormInput";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createGenericWithCurrentUser } from "@/actions/generic";
import { Debt } from "@prisma/client";
import { useRouter } from "next/navigation";

const CreateUserDebtForm = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateDebtSchemaType>({
    defaultValues: {
      name: "",
      debtAmount: 10,
      currentAmount: 0,
      dueDate: "",
    },
    resolver: zodResolver(CreateDebtSchema),
  });

  const onSubmit = async (data: CreateDebtSchemaType) => {
    startTransition(async () => {
      const result = await createGenericWithCurrentUser<Debt>({
        tableName: "debt",
        data: {
          ...data,
          dueDate: new Date(data.dueDate),
        },
      });

      if (result?.error) {
        showErrorToast("An error occurred.", result.error as string);
      } else {
        router.refresh();
        showSuccessToast("Debt created.", "Your debt has been created.");
        dispatch(closeGenericModal());
      }
    });
  };

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
          errors={errors}
          className="w-full"
          onChange={(value) => {
            setValue("dueDate", value);
          }}
        />
        <Button type="submit" disabled={isSubmitting || isPending}>
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateUserDebtForm;
