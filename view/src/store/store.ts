import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import returnReducer from './slices/returnSlice';
import contactReducer from './slices/contactSlice';
import inventoryReducer from './slices/inventorySlice';
import consumptionReducer from './slices/consumptionSlice';
import unitOfMeasureReducer from './slices/unitOfMeasureSlice';
import purchaseRequestReducer from './slices/purchaseRequestSlice';
import purchaseApprovalReducer from './slices/purchaseApprovalSlice';
import purchaseScheduleReducer from './slices/purchaseScheduleSlice';
import monthlyPurchaseScheduleReducer from './slices/monthlyPurchaseScheduleSlice';

interface RootState {
  auth: ReturnType<typeof authReducer>;
  item: ReturnType<typeof itemReducer>;
  return: ReturnType<typeof returnReducer>;
  contact: ReturnType<typeof contactReducer>;
  inventory: ReturnType<typeof inventoryReducer>;
  consumption: ReturnType<typeof consumptionReducer>;
  unitOfMeasure: ReturnType<typeof unitOfMeasureReducer>;
  purchaseRequest: ReturnType<typeof purchaseRequestReducer>;
  purchaseApproval: ReturnType<typeof purchaseApprovalReducer>;
  purchaseSchedule: ReturnType<typeof purchaseScheduleReducer>;
  monthlyPurchaseSchedule: ReturnType<typeof monthlyPurchaseScheduleReducer>;
}

const rootReducer = {
    auth: authReducer,
    item: itemReducer,
    return: returnReducer,
    contact: contactReducer,
    inventory: inventoryReducer,
    consumption: consumptionReducer,
    unitOfMeasure: unitOfMeasureReducer,
    purchaseRequest: purchaseRequestReducer,
    purchaseApproval: purchaseApprovalReducer,
    purchaseSchedule: purchaseScheduleReducer,
    monthlyPurchaseSchedule: monthlyPurchaseScheduleReducer,
}

const persistConfig: PersistConfig<RootState> = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

export const store = configureStore({
    reducer:  persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;