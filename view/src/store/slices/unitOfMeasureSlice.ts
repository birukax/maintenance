import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";

interface UnitOfMeasureState {
  unitOfMeasures: DataState<Data[]>;
  unitOfMeasure: DataState<Data | null>;
}

const initialState: UnitOfMeasureState = {
  unitOfMeasures: { data: [], loading: false, error: null },
  unitOfMeasure: { data: null, loading: false, error: null },
};

export const fetchUnitOfMeasures = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
  "unitOfMeasure/fetchUnitOfMeasures",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/inventory/unit-of-measures/", { params });
      return response.data;
    } catch (error) {

      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || "Failed to fetch unit Of Measures.");
      }
      return rejectWithValue('An error occured')
    }
  });

export const fetchUnitOfMeasure = createAsyncThunk<Data, number | string, { rejectValue: any }>(
  "unitOfMeasure/fetchUnitOfMeasure",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/unit-of-measures/${id}/`);
      return response.data;
    } catch (error) {

      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || 'Failed to fetch unit of measure.');
      }
      return rejectWithValue('An error occured')
    }
  });

export const createUnitOfMeasure = createAsyncThunk<Data, FormData, { rejectValue: any }>(
  "unitOfMeasure/createUnitOfMeasure",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/inventory/unit-of-measures/", formData);
      return response.data;
    } catch (error) {

      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || 'Failed to create unit of measure.');
      }
      return rejectWithValue('An error occured')
    }
  }
);

export const updateUnitOfMeasure = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
  "unitOfMeasure/updateUnitOfMeasure",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/inventory/unit-of-measures/${id}/`, formData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || 'Failed to update unit of measure.');
      }
      return rejectWithValue('An error occured')
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
      .addCase(fetchUnitOfMeasures.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
      .addCase(fetchUnitOfMeasure.fulfilled, (state, action: PayloadAction<Data>) => {
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
      .addCase(createUnitOfMeasure.fulfilled, (state, action: PayloadAction<Data>) => {
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
      .addCase(updateUnitOfMeasure.fulfilled, (state, action: PayloadAction<Data>) => {
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
