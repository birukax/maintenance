import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import areaReducer from './slices/areaSlice';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import yearReducer from './slices/yearSlice';
import shelfReducer from './slices/shelfSlice';
import plantReducer from './slices/plantSlice';
import storage from 'redux-persist/lib/storage';
import returnReducer from './slices/returnSlice';
import contactReducer from './slices/contactSlice';
import profileReducer from './slices/profileSlice';
import machineReducer from './slices/machineSlice';
import locationReducer from './slices/locationSlice';
import transferReducer from './slices/transferSlice';
import shelfRowReducer from './slices/shelfRowSlice';
import shelfBoxReducer from './slices/shelfBoxSlice';
import activityReducer from './slices/activitySlice';
import scheduleReducer from './slices/scheduleSlice';
import clearanceReducer from './slices/clearanceSlice';
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
import transferApprovalReducer from './slices/transferApprovalSlice';
import purchaseScheduleReducer from './slices/purchaseScheduleSlice';
import workOrderActivityReducer from './slices/workOrderActivitySlice';
import monthlyPurchaseScheduleReducer from './slices/monthlyPurchaseScheduleSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  item: itemReducer,
  year: yearReducer,
  area: areaReducer,
  plant: plantReducer,
  shelf: shelfReducer,
  return: returnReducer,
  contact: contactReducer,
  profile: profileReducer,
  machine: machineReducer,
  location: locationReducer,
  transfer: transferReducer,
  shelfRow: shelfRowReducer,
  shelfBox: shelfBoxReducer,
  activity: activityReducer,
  schedule: scheduleReducer,
  clearance: clearanceReducer,
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
  transferApproval: transferApprovalReducer,
  purchaseSchedule: purchaseScheduleReducer,
  workOrderActivity: workOrderActivityReducer,
  monthlyPurchaseSchedule: monthlyPurchaseScheduleReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
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