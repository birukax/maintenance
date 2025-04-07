import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import contactReducer from './slices/contactSlice';

// type RootState = ReturnType<typeof itemReducer>;

const rootReducer = {
    auth: authReducer,
    item: itemReducer,
    contact: contactReducer,
}

const persistConfig: PersistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

export const store = configureStore({
    reducer:  persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            // Ignore redux-persist actions for serializability check
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;