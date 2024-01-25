import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Investment } from "@prisma/client";
import { getGeneric } from "@/actions/generic";

interface CurrentInvestmentState {
  currentInvestment: Investment | null;
  isLoading: boolean;
}

const initialState: CurrentInvestmentState = {
  currentInvestment: null,
  isLoading: false,
};

export const fetchInvestmentById = createAsyncThunk(
  "investments/fetchInvestmentById",
  async (investmentId: string) => {
    try {
      const result = await getGeneric<Investment>({
        tableName: "investment",
        whereCondition: { id: investmentId },
      });

      if (result?.error || !result?.data) return null;

      return result.data;
    } catch (error) {
      throw error;
    }
  }
);

const currentInvestmentSlice = createSlice({
  name: "currentInvestment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestmentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvestmentById.fulfilled, (state, action) => {
        state.currentInvestment = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInvestmentById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default currentInvestmentSlice.reducer;
