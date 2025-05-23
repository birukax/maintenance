import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import returnReducer from './slices/returnSlice';
import contactReducer from './slices/contactSlice';
import yearReducer from './slices/yearSlice';
import profileReducer from './slices/profileSlice';
import machineReducer from './slices/machineSlice';
import locationReducer from './slices/locationSlice';
import plantReducer from './slices/plantSlice';
import shelfReducer from './slices/shelfSlice';
import shelfRowReducer from './slices/shelfRowSlice';
import shelfBoxReducer from './slices/shelfBoxSlice';
import areaReducer from './slices/areaSlice';
import activityReducer from './slices/activitySlice';
import scheduleReducer from './slices/scheduleSlice';
import breakdownReducer from './slices/breakdownSlice';
import equipmentReducer from './slices/equipmentSlice';
import inventoryReducer from './slices/inventorySlice';
import workOrderReducer from './slices/workOrderSlice';
import consumptionReducer from './slices/consumptionSlice';
import activityTypeReducer from './slices/activityTypeSlice';
import workOrderTypeReducer from './slices/workOrderTypeSlice';
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
  year: ReturnType<typeof yearReducer>;
  profile: ReturnType<typeof profileReducer>;
  machine: ReturnType<typeof machineReducer>;
  location: ReturnType<typeof locationReducer>;
  plant: ReturnType<typeof plantReducer>;
  shelf: ReturnType<typeof shelfReducer>;
  shelfRow: ReturnType<typeof shelfRowReducer>;
  shelfBox: ReturnType<typeof shelfBoxReducer>;
  area: ReturnType<typeof areaReducer>;
  activity: ReturnType<typeof activityReducer>;
  schedule: ReturnType<typeof scheduleReducer>;
  breakdown: ReturnType<typeof breakdownReducer>;
  equipment: ReturnType<typeof equipmentReducer>;
  inventory: ReturnType<typeof inventoryReducer>;
  workOrder: ReturnType<typeof workOrderReducer>;
  consumption: ReturnType<typeof consumptionReducer>;
  activityType: ReturnType<typeof activityTypeReducer>;
  workOrderType: ReturnType<typeof workOrderTypeReducer>;
  unitOfMeasure: ReturnType<typeof unitOfMeasureReducer>;
  purchaseRequest: ReturnType<typeof purchaseRequestReducer>;
  purchaseApproval: ReturnType<typeof purchaseApprovalReducer>;
  purchaseSchedule: ReturnType<typeof purchaseScheduleReducer>;
  monthlyPurchaseSchedule: ReturnType<typeof monthlyPurchaseScheduleReducer>;
}

const rootReducer = combineReducers({
    auth: authReducer,
    item: itemReducer,
    return: returnReducer,
    contact: contactReducer,
    year: yearReducer,
    profile: profileReducer,
    machine: machineReducer,
    location: locationReducer,
    plant: plantReducer,
    shelf: shelfReducer,
    shelfRow: shelfRowReducer,
    shelfBox: shelfBoxReducer,
    area: areaReducer,
    activity: activityReducer,
    schedule: scheduleReducer,
    breakdown: breakdownReducer,
    equipment: equipmentReducer,
    inventory: inventoryReducer,
    workOrder: workOrderReducer,
    consumption: consumptionReducer,
    activityType: activityTypeReducer,
    workOrderType: workOrderTypeReducer,
    unitOfMeasure: unitOfMeasureReducer,
    purchaseRequest: purchaseRequestReducer,
    purchaseApproval: purchaseApprovalReducer,
    purchaseSchedule: purchaseScheduleReducer,
    monthlyPurchaseSchedule: monthlyPurchaseScheduleReducer,
})

const persistConfig: PersistConfig<RootState> = {
    key: 'root',
    storage,
    whitelist: ['auth'],
    blacklist: ['contact','unitOfMeasure'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer:  persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;