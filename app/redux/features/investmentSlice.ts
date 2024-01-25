import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Investment } from "@prisma/client";
import { getGenericListByCurrentUser } from "@/actions/generic";

export type SerializedInvestment = Omit<Investment, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  type: string; // Added type property
};

interface InvestmentsState {
  investments: SerializedInvestment[] | null;
  isLoading: boolean;
}

const initialState: InvestmentsState = {
  investments: null,
  isLoading: false,
};

export const fetchInvestments = createAsyncThunk("investments/fetchInvestments", async () => {
  const result = await getGenericListByCurrentUser<Investment>({
    tableName: "investment",
  });

  if (result?.error || !result || !result.data) {
    return null;
  }

  const investments = result.data;

  const mappedInvestments = investments.map((data) => ({
    ...data,
    createdAt: new Date(data.createdAt).toLocaleDateString(),
    updatedAt: new Date(data.updatedAt).toLocaleDateString(),
    type: data.investmentType, // Ensuring the type property is included in the mapped investments
  }));

  return mappedInvestments;
});

const investmentsSlice = createSlice({
  name: "investments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.isLoading = false;
          return;
        }
        state.investments = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInvestments.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default investmentsSlice.reducer;
