import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Sorting } from '../../components/SearchBar';

export type SearchParams = {
    category: Category,
    search_string: string,
    sorting: Sorting,
    start_index: number
}

const initialState: { params: SearchParams, newSearch: boolean } = {
    params: {
        category: 'all',
        search_string: '',
        sorting: 'relevance',
        start_index: 0
    },
    newSearch: false //set the flag only when search parameters changed. start_index excluded
};

export const searchParamsSlice = createSlice({
    name: 'searchParams',
    initialState,
    reducers: {
        updateParams: (state, { payload }: PayloadAction<SearchParams>) => {
            state.newSearch = state.params !== payload;
            let newParams = false;
            const payloadArray = Object.values(payload);
            Object.values(state.params).forEach((stateValue, index) => {
                if (typeof stateValue === 'string' && stateValue !== payloadArray[index]) {
                    newParams = true;
                }
            });
            state.newSearch = newParams;
            state.params = payload;
        },
        incrementStartIndex: (state) => {
            state.newSearch = false;
            state.params.start_index += 30;
        }
    }
});

export const { updateParams, incrementStartIndex } = searchParamsSlice.actions;

export default searchParamsSlice.reducer;
