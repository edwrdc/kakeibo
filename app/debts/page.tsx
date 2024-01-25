import { getGenericListByCurrentUser } from "@/actions/generic";
import DebtsPageClient from "./DebtsPageClient";
import { SerializedDebt } from "../redux/features/debtSlice";

const DebtsPage = async () => {
  const result = await getGenericListByCurrentUser<SerializedDebt>({
    tableName: "debt",
  });

  return (
    <main>
      <DebtsPageClient debts={result?.data || []} />
    </main>
  );
};

export default DebtsPage;
