
import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { setupStore } from './store';
import type { AppStore, RootState } from './store';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: AppStore
}

export function renderWithProviders(ui: React.ReactElement, { preloadedState = {}, store = setupStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {}) {
    setupListeners(store.dispatch);

    function Wrapper({ children }: { children: ReactNode }) {
        return <Provider store={store}>{children}</Provider>;
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
