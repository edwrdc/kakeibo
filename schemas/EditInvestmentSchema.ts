import { z } from "zod";
import CreateInvestmentSchema from "./CreateInvestmentSchema";

const EditInvestmentSchema = CreateInvestmentSchema;

export type EditInvestmentSchemaType = z.infer<typeof EditInvestmentSchema>;

export default EditInvestmentSchema;
