
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import type { PreloadedState } from '@reduxjs/toolkit';
import googleBooksApiSlice from './services/googleBooksApiSlice';
import searchParamsSlice from './slices/searchParamsSlice';

const rootReducer = combineReducers({
    [googleBooksApiSlice.reducerPath]: googleBooksApiSlice.reducer,
    searchParams: searchParamsSlice
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(googleBooksApiSlice.middleware),
        preloadedState
    });
};

export const store = setupStore({});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = ReturnType<typeof setupStore>['dispatch'];
