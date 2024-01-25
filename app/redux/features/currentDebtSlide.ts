import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Debt } from "@prisma/client";
import { getGeneric } from "@/actions/generic";

interface CurrentDebtState {
  currentDebt: Debt | null;
  isLoading: boolean;
}

const initialState: CurrentDebtState = {
  currentDebt: null,
  isLoading: false,
};

export const fetchDebtById = createAsyncThunk(
  "debts/fetchDebtById",
  async (debtId: string) => {
    try {
      const result = await getGeneric<Debt>({
        tableName: "debt",
        whereCondition: { id: debtId },
      });

      if (result?.error || !result?.data) return null;

      return result.data;
    } catch (error) {
      throw error;
    }
  }
);

const currentDebtSlice = createSlice({
  name: "currentDebt",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebtById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDebtById.fulfilled, (state, action) => {
        state.currentDebt = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDebtById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default currentDebtSlice.reducer;
