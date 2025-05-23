import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";

interface DataState {
  data: [] | null;
  loading: boolean;
  error: string | null;
}

interface InventoryState {
  inventories: DataState;
  inventory: DataState;
}

const initialState: InventoryState = {
  inventories: { data: [], loading: false, error: null },
  inventory: { data: [], loading: false, error: null },
};

export const fetchInventories = createAsyncThunk<
  [],
  {params:null},
  { rejectValue: string }
>("inventory/fetchInventories", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get("/inventory/inventories/",{params});
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data || "Failed to fetch inventories"
    );
  }
});

export const revaluateStock = createAsyncThunk<
  [],
  void,
  { rejectValue: string }
>("inventory/revaluateStock", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/inventory/inventories/revaluate_stock/");
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data || "Failed to reavaluate stock"
    );
  }
});

export const fetchInventory = createAsyncThunk<
  [],
  number,
  { rejectValue: string }
>("inventory/fetchInventory", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/inventory/inventories/${id}/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createInventory = createAsyncThunk<
  [],
  formData,
  { rejectValue: string }
>("inventory/createInventory", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/inventory/inventories/", formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateInventory = createAsyncThunk<
  [],
  { id: string; formData: { [key: string] } },
  { rejectValue: string }
>(
  "inventory/updateInventory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/inventory/inventories/${id}/`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
      .addCase(
        fetchInventories.fulfilled,
        (state, action: PayloadAction<[]>) => {
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
      .addCase(
        revaluateStock.fulfilled,
        (state, action: PayloadAction<[]>) => {
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
      .addCase(fetchInventory.fulfilled, (state, action: PayloadAction<[]>) => {
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
        (state, action: PayloadAction<[]>) => {
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
        (state, action: PayloadAction<[]>) => {
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
