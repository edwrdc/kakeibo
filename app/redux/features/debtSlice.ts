import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Debt } from "@prisma/client";
import { getGenericListByCurrentUser } from "@/actions/generic";

export type SerializedDebt = Omit<Debt, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

interface DebtsState {
  debts: SerializedDebt[] | null;
  isLoading: boolean;
}

const initialState: DebtsState = {
  debts: null,
  isLoading: false,
};

export const fetchDebts = createAsyncThunk("debts/fetchDebts", async () => {
  const result = await getGenericListByCurrentUser<Debt>({
    tableName: "debt",
  });

  if (result?.error || !result || !result.data) {
    return null;
  }

  const debts = result.data;

  const mappedDebts = debts.map((data) => ({
    ...data,
    createdAt: new Date(data.createdAt).toLocaleDateString(),
    updatedAt: new Date(data.updatedAt).toLocaleDateString(),
  }));

  return mappedDebts;
});

const debtsSlice = createSlice({
  name: "debts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.isLoading = false;
          return;
        }
        state.debts = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDebts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default debtsSlice.reducer;
