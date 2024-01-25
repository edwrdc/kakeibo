import { SerializedDebt } from "@/app/redux/features/debtSlice";
import DebtCard from "../components/DebtCard";
import CreateDebtButton from "../components/CreateButtons/CreateDebtButton";
import MotionDiv from "@/components/animation/MotionDiv";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";

const DebtsPageClient = ({ debts }: { debts: SerializedDebt[] }) => {
  const renderNoDebtsState = () => (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.5, type: "just" }}
      className="flex justify-center items-start lg:items-center flex-col gap-4"
    >
      <h3 className="inline-block text-lg lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
        No debts were found.
      </h3>
      <p>Add a debt to get started!</p>
    </MotionDiv>
  );

  const renderDebts = () => (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <AnimatePresenceClient>
          {debts?.map((debt) => (
            <DebtCard debt={debt} key={debt.id} />
          ))}
        </AnimatePresenceClient>
      </div>
    </div>
  );

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl lg:mb-4 text-primary">Debts</h2>
      </MotionDiv>
      <div className="flex justify-center lg:items-center flex-col gap-2">
        {debts.length > 0 ? renderDebts() : renderNoDebtsState()}
        <CreateDebtButton className="mt-4 self-start" />
      </div>
    </div>
  );
};

export default DebtsPageClient;
