"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchInvestmentById } from "@/app/redux/features/currentInvestmentSlice";
import FormLoadingSpinner from "../../FormLoadingSpinner";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import {
    showDefaultToast,
    showErrorToast,
    showSuccessToast,
} from "@/components/ui/use-toast";
import EditInvestmentSchema, {
    EditInvestmentSchemaType,
} from "@/schemas/EditInvestmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { updateInvestmentByIdAction } from "@/actions";
import { useRouter } from "next/navigation";

interface IEditUserInvestmentFormProps {
    entityId: string;
}

const EditUserInvestmentForm = ({ entityId }: IEditUserInvestmentFormProps) => {
    let [isPending, startTransition] = useTransition();
    const { currentInvestment } = useAppSelector((state) => state.currentInvestmentReducer);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading, isSubmitting },
        setValue,
        getValues,
    } = useForm<EditInvestmentSchemaType>({
        defaultValues: {
            name: "",
            investmentType: "",
            amount: 0,
            startDate: "",
            maturityDate: "",
            rateOfReturn: 0,
        },
        resolver: zodResolver(EditInvestmentSchema),
    });

    const hasMadeNoChanges = () => {
        const { name, investmentType, amount, startDate, maturityDate, rateOfReturn } = getValues();
        return (
            name === currentInvestment?.name &&
            investmentType === currentInvestment?.investmentType &&
            amount === currentInvestment?.amount &&
            startDate === currentInvestment?.startDate?.toISOString() &&
            maturityDate === currentInvestment?.maturityDate?.toISOString() &&
            rateOfReturn === currentInvestment?.rateOfReturn
        );
    };

    useEffect(() => {
        if (entityId) {
            dispatch(fetchInvestmentById(entityId));
        }
    }, [dispatch, entityId]);

    useEffect(() => {
        if (currentInvestment) {
            setValue("name", currentInvestment.name);
            setValue("investmentType", currentInvestment.investmentType);
            setValue("amount", currentInvestment.amount);
            setValue("startDate", currentInvestment.startDate?.toISOString());
            setValue("maturityDate", currentInvestment.maturityDate?.toISOString());
            setValue("rateOfReturn", currentInvestment.rateOfReturn);
        }
    }, [currentInvestment, setValue]);

    const onSubmit = async (data: EditInvestmentSchemaType) => {
        if (hasMadeNoChanges()) {
            return showDefaultToast(
                "No changes made.",
                "You haven't made any changes."
            );
        }

        let payload = {
            investmentId: entityId,
            ...data,
            startDate: new Date(data.startDate).toISOString(),
            maturityDate: new Date(data.maturityDate).toISOString(),
        };

        startTransition(async () => {
            const result = await updateInvestmentByIdAction(payload);
            if (result.error) {
                showErrorToast("An error occurred.", result.error);
            } else {
                router.refresh();
                showSuccessToast("Investment updated", "Investment updated successfully.");
                dispatch(closeGenericModal());
            }
        });
    };

    if (!currentInvestment) {
        return <FormLoadingSpinner />;
    }

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
                    placeholder={"Amount"}
                    type={"number"}
                    register={register}
                    errors={errors}
                />
                <FormInput
                    name={"startDate"}
                    label={"Start Date"}
                    placeholder={"Start date"}
                    type={"date"}
                    register={register}
                    errors={errors}
                />
                <FormInput
                    name={"maturityDate"}
                    label={"Maturity Date"}
                    placeholder={"Maturity date"}
                    type={"date"}
                    register={register}
                    errors={errors}
                />
                <FormInput
                    name={"rateOfReturn"}
                    label={"Rate of Return"}
                    placeholder={"Rate of return"}
                    type={"number"}
                    register={register}
                    errors={errors}
                />
                <Button type="submit" disabled={isLoading || isSubmitting || isPending}>
                    Update
                </Button>
            </div>
        </form>
    );
};

export default EditUserInvestmentForm;
