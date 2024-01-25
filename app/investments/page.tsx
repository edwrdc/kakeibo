import { getGenericListByCurrentUser } from "@/actions/generic";
import InvestmentsPageClient from "./InvestmentsPageClient";
import { SerializedInvestment } from "../redux/features/investmentSlice";

const InvestmentsPage = async () => {
  const result = await getGenericListByCurrentUser<SerializedInvestment>({
    tableName: "investment",
  });

  return (
    <main>
      <InvestmentsPageClient investments={result?.data || []} />
    </main>
  );
};

export default InvestmentsPage;
