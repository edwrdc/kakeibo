import { z } from "zod";
import CreateDebtSchema from "./CreateDebtSchema";

const EditDebtSchema = CreateDebtSchema;

export type EditDebtSchemaType = z.infer<typeof EditDebtSchema>;

export default EditDebtSchema;
