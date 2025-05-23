import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";

interface DataState {
  data: [] | null;
  loading: boolean;
  error: string | null;
}

interface UnitOfMeasureState {
  unitOfMeasures: DataState;
  unitOfMeasure: DataState;
}

const initialState: UnitOfMeasureState = {
  unitOfMeasures: { data: [], loading: false, error: null },
  unitOfMeasure: { data: [], loading: false, error: null },
};

export const fetchUnitOfMeasures = createAsyncThunk<
  [],
  {params:null},
  { rejectValue: string }
>("unitOfMeasure/fetchUnitOfMeasures", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get("/inventory/unit-of-measures/",{params});
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data || "Failed to fetch unitOfMeasures"
    );
  }
});

export const fetchUnitOfMeasure = createAsyncThunk<
  [],
  number,
  { rejectValue: string }
>("unitOfMeasure/fetchUnitOfMeasure", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/inventory/unit-of-measures/${id}/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createUnitOfMeasure = createAsyncThunk<
  [],
  formData,
  { rejectValue: string }
>(
  "unitOfMeasure/createUnitOfMeasure",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/inventory/unit-of-measures/", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUnitOfMeasure = createAsyncThunk<
  [],
  { id: string; formData: { [key: string] } },
  { rejectValue: string }
>(
  "unitOfMeasure/updateUnitOfMeasure",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/inventory/unit-of-measures/${id}/`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const unitOfMeasureSlice = createSlice({
  name: "unitOfMeasure",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUnitOfMeasures.pending, (state) => {
        state.unitOfMeasures.loading = true;
        state.unitOfMeasures.error = null;
      })
      .addCase(
        fetchUnitOfMeasures.fulfilled,
        (state, action: PayloadAction<[]>) => {
          state.unitOfMeasures.loading = false;
          state.unitOfMeasures.data = action.payload;
        }
      )
      .addCase(fetchUnitOfMeasures.rejected, (state, action) => {
        state.unitOfMeasures.loading = false;
        state.unitOfMeasures.error = action.payload || "Unknown error";
      })
      .addCase(fetchUnitOfMeasure.pending, (state) => {
        state.unitOfMeasure.loading = true;
        state.unitOfMeasure.error = null;
      })
      .addCase(
        fetchUnitOfMeasure.fulfilled,
        (state, action: PayloadAction<[]>) => {
          state.unitOfMeasure.loading = false;
          state.unitOfMeasure.data = action.payload;
        }
      )
      .addCase(fetchUnitOfMeasure.rejected, (state, action) => {
        state.unitOfMeasure.loading = false;
        state.unitOfMeasure.error = action.payload || "Unknown error";
      })
      .addCase(createUnitOfMeasure.pending, (state) => {
        state.unitOfMeasure.loading = true;
        state.unitOfMeasure.error = null;
      })
      .addCase(
        createUnitOfMeasure.fulfilled,
        (state, action: PayloadAction<[]>) => {
          state.unitOfMeasure.loading = false;
          state.unitOfMeasure.data = action.payload;
        }
      )
      .addCase(createUnitOfMeasure.rejected, (state, action) => {
        state.unitOfMeasure.loading = false;
        state.unitOfMeasure.error = action.payload || "Unknown error";
      })
      .addCase(updateUnitOfMeasure.pending, (state) => {
        state.unitOfMeasure.loading = true;
        state.unitOfMeasure.error = null;
      })
      .addCase(
        updateUnitOfMeasure.fulfilled,
        (state, action: PayloadAction<[]>) => {
          state.unitOfMeasure.loading = false;
          state.unitOfMeasure.data = action.payload;
        }
      )
      .addCase(updateUnitOfMeasure.rejected, (state, action) => {
        state.unitOfMeasure.loading = false;
        state.unitOfMeasure.error = action.payload || "Unknown error";
      });
  },
});

// export const { createUnitOfMeasure, updateUnitOfMeasure, deleteUnitOfMeasure } = unitOfMeasureSlice.actions;
export default unitOfMeasureSlice.reducer;
