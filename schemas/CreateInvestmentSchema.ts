import { z } from "zod";

const CreateInvestmentSchema = z.object({
  name: z.string().min(1).max(50),
  investmentType: z.string().min(1).max(50),
  amount: z.coerce.number().min(1),
  startDate: z.string().nonempty("Start Date is required"),
  maturityDate: z.string().nonempty("maturity Date is required"),
  rateOfReturn: z.coerce.number().min(0),
});

export type CreateInvestmentSchemaType = z.infer<typeof CreateInvestmentSchema>;

export default CreateInvestmentSchema;
