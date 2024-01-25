import { z } from "zod";

const CreateDebtSchema = z.object({
  name: z.string().nonempty(),
  debtAmount: z.coerce.number().min(1),
  currentAmount: z.coerce.number().min(0),
  dueDate: z.string().nonempty("date is required"),
});

export type CreateDebtSchemaType = z.infer<typeof CreateDebtSchema>;

export default CreateDebtSchema;
