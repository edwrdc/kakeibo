"use client";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux/hooks";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateInvestmentSchema, {
    CreateInvestmentSchemaType,
} from "@/schemas/CreateInvestmentSchema";
import FormInput from "@/components/FormInput";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createGenericWithCurrentUser } from "@/actions/generic";
import { Investment } from "@prisma/client";
import { useRouter } from "next/navigation";

const CreateInvestmentForm = () => {
    let [isPending, startTransition] = useTransition();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateInvestmentSchemaType>({
        defaultValues: {
            name: "",
            investmentType: "",
            amount: 0,
            startDate: "",
            maturityDate: "",
            rateOfReturn: 0,
        },
        resolver: zodResolver(CreateInvestmentSchema),
    });

    const onSubmit = async (data: CreateInvestmentSchemaType) => {
        startTransition(async () => {
            const result = await createGenericWithCurrentUser<Investment>({
                tableName: "investment",
                data: {
                    ...data,
                    startDate: new Date(data.startDate),
                    maturityDate: new Date(data.maturityDate),
                },
            });

            if (result?.error) {
                showErrorToast("An error occurred.", result.error as string);
            } else {
                router.refresh();
                showSuccessToast("Investment created.", "Your investment has been created.");
                dispatch(closeGenericModal());
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
                <FormInput
                    name={"name"}
                    label={"Investment Name"}
                    placeholder={"Investment name"}
                    type={"text"}
                    register={register}
                    errors={errors}
                />
                <FormInput
                    name={"investmentType"}
                    label={"Investment Type"}
                    placeholder={"Investment type"}
                    type={"text"}
                    register={register}
                    errors={errors}
                />
                <FormInput
                    name={"amount"}
                    label={"Amount"}
                    placeholder={"Investment amount"}
                    type={"number"}
                    register={register}
                    errors={errors}
                />
                <DatePicker
                    name={"startDate"}
                    label={"Start Date"}
                    placeholder={"Select a start date"}
                    register={register}
                    errors={errors}
                    className="w-full"
                    onChange={(value) => {
                        setValue("startDate", value);
                    }}
                />
                <DatePicker
                    name={"maturityDate"}
                    label={"Maturity Date"}
                    placeholder={"Select a maturity date"}
                    register={register}
                    errors={errors}
                    className="w-full"
                    onChange={(value) => {
                        setValue("maturityDate", value);
                    }}
                />
                <FormInput
                    name={"rateOfReturn"}
                    label={"Rate of Return"}
                    placeholder={"Rate of return"}
                    type={"number"}
                    register={register}
                    errors={errors}
                />
                <Button type="submit" disabled={isSubmitting || isPending}>
                    Create
                </Button>
            </div>
        </form>
    );
};

export default CreateInvestmentForm;
