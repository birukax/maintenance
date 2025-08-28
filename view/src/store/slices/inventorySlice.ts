import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";

interface InventoryState {
  inventories: DataState<PaginatedData<Data[]> | Data[] | []>;
  inventory: DataState<Data | null>;
}

const initialState: InventoryState = {
  inventories: { data: [], loading: false, error: null },
  inventory: { data: null, loading: false, error: null },
};

export const fetchInventories = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
  "inventory/fetchInventories",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/inventory/inventories/", { params });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || "Failed to fetch inventories");
      }
      return rejectWithValue('An error occured');
    }
  });

export const revaluateStock = createAsyncThunk<PaginatedData<Data[]>, void, { rejectValue: any }>(
  "inventory/revaluateStock",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/inventory/inventories/revaluate_stock/");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || "Failed to reavaluate stock");
      }
      return rejectWithValue('An error occured');
    }
  });

export const fetchInventory = createAsyncThunk<Data, number | string, { rejectValue: any }>(
  "inventory/fetchInventory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/inventories/${id}/`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || 'Failed to fetch inventory.');
      }
      return rejectWithValue('An error occured');
    }
  });

export const createInventory = createAsyncThunk<Data, FormData, { rejectValue: any }>(
  "inventory/createInventory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/inventory/inventories/", formData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || 'Failed to create inventory.');
      }
      return rejectWithValue('An error occured');
    }
  });

export const updateInventory = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
  "inventory/updateInventory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/inventory/inventories/${id}/`, formData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data || 'Failed to update inventory.');
      }
      return rejectWithValue('An error occured');
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchInventories.pending, (state) => {
        state.inventories.loading = true;
        state.inventories.error = null;
      })
      .addCase(fetchInventories.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
        state.inventories.loading = false;
        state.inventories.data = action.payload;
      }
      )
      .addCase(fetchInventories.rejected, (state, action) => {
        state.inventories.loading = false;
        state.inventories.error = action.payload || "Unknown error";
      })
      .addCase(revaluateStock.pending, (state) => {
        state.inventories.loading = true;
        state.inventories.error = null;
      })
      .addCase(revaluateStock.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
        state.inventories.loading = false;
        state.inventories.data = action.payload;
      }
      )
      .addCase(revaluateStock.rejected, (state, action) => {
        state.inventories.loading = false;
        state.inventories.error = action.payload || "Unknown error";
      })
      .addCase(fetchInventory.pending, (state) => {
        state.inventory.loading = true;
        state.inventory.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action: PayloadAction<Data>) => {
        state.inventory.loading = false;
        state.inventory.data = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.inventory.loading = false;
        state.inventory.error = action.payload || "Unknown error";
      })
      .addCase(createInventory.pending, (state) => {
        state.inventory.loading = true;
        state.inventory.error = null;
      })
      .addCase(
        createInventory.fulfilled,
        (state, action: PayloadAction<Data>) => {
          state.inventory.loading = false;
          state.inventory.data = action.payload;
        }
      )
      .addCase(createInventory.rejected, (state, action) => {
        state.inventory.loading = false;
        state.inventory.error = action.payload || "Unknown error";
      })
      .addCase(updateInventory.pending, (state) => {
        state.inventory.loading = true;
        state.inventory.error = null;
      })
      .addCase(
        updateInventory.fulfilled,
        (state, action: PayloadAction<Data>) => {
          state.inventory.loading = false;
          state.inventory.data = action.payload;
        }
      )
      .addCase(updateInventory.rejected, (state, action) => {
        state.inventory.loading = false;
        state.inventory.error = action.payload || "Unknown error";
      });
  },
});

// export const { createInventory, updateInventory, deleteInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
