import { SerializedDebt } from "@/app/redux/features/debtSlice";
import DebtCard from "./DebtCard";
import CreateDebtButton from "./CreateButtons/CreateDebtButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";
import MotionDiv from "@/components/animation/MotionDiv";

const DebtStatus = ({ debts }: { debts: SerializedDebt[] }) => {
  if (debts.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary">No debts found.</p>
          <CreateDebtButton />
        </MotionDiv>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresenceClient>
        {debts.map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        ))}
      </AnimatePresenceClient>
    </div>
  );
};

export default DebtStatus;
