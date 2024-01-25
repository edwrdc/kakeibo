import { SerializedInvestment } from "@/app/redux/features/investmentSlice";
import InvestmentCard from "./InvestmentCard";
import CreateInvestmentButton from "./CreateButtons/CreateInvestmentButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";
import MotionDiv from "@/components/animation/MotionDiv";

const InvestmentStatus = ({ investments }: { investments: SerializedInvestment[] }) => {
  if (!investments || investments.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary">No investments found.</p>
          <CreateInvestmentButton />
        </MotionDiv>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresenceClient>
        {investments.map((investment) => (
          <InvestmentCard key={investment.id} investment={investment} />
        ))}
      </AnimatePresenceClient>
    </div>
  );
};

export default InvestmentStatus;
