import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import contactReducer from './slices/contactSlice';
import inventoryReducer from './slices/inventorySlice';
import unitOfMeasureReducer from './slices/unitOfMeasureSlice';
import purchaseRequestReducer from './slices/purchaseRequestSlice';
import purchaseScheduleReducer from './slices/purchaseScheduleSlice';
import monthlyPurchaseScheduleReducer from './slices/monthlyPurchaseScheduleSlice';

interface RootState {
  auth: ReturnType<typeof authReducer>;
  item: ReturnType<typeof itemReducer>;
  contact: ReturnType<typeof contactReducer>;
  inventory: ReturnType<typeof inventoryReducer>;
  unitOfMeasure: ReturnType<typeof unitOfMeasureReducer>;
  purchaseRequest: ReturnType<typeof purchaseRequestReducer>;
  purchaseSchedule: ReturnType<typeof purchaseScheduleReducer>;
  monthlyPurchaseSchedule: ReturnType<typeof monthlyPurchaseScheduleReducer>;
}

const rootReducer = {
    auth: authReducer,
    item: itemReducer,
    contact: contactReducer,
    inventory: inventoryReducer,
    unitOfMeasure: unitOfMeasureReducer,
    purchaseRequest: purchaseRequestReducer,
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