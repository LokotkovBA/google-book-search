
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks/server';
import { renderWithProviders } from '../redux/test-utlis';
import { getGoogleApiKey } from '../utils/env';
import { SearchBar } from './SearchBar';

const ComponentToTest = () => {
    return (
        <MemoryRouter>
            <SearchBar />
        </MemoryRouter>);
};

describe('SearchBar', () => {
    it('should display error fetching', async () => {
        server.use(rest.get('https://www.googleapis.com/books/v1/volumes', (req, res, ctx) => {
            return res(ctx.status(400), ctx.delay(30));
        }));
        renderWithProviders(<ComponentToTest />);
        const inputElement = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
        inputElement.focus();
        await userEvent.keyboard('{enter}');
        expect(await screen.findByText(/incorrect/i)).toBeInTheDocument();
        await userEvent.keyboard('123{enter}');
        expect(await screen.findByText(/google/i)).toBeInTheDocument();
    });

    it('should set initial store value', () => {
        const { store } = renderWithProviders(<ComponentToTest />);
        const state = store.getState();
        expect(state.searchParams.params).toStrictEqual({
            category: 'all',
            search_string: '',
            sorting: 'relevance',
            start_index: 0
        });
    });

    it('should change search store values, trigger new search and query parameters should be valid', async () => {
        const testString = 'Dawn';
        const testCategory = 'art';
        const testSorting = 'newest';
        let qQueryParam = '';
        let orderByQueryParam = '';
        let startIndexParam = '';
        let maxResultsParam = '';
        let keyParam = '';

        //get query values from mocked fetch
        server.use(rest.get('*', (req, res, ctx) => {
            qQueryParam = req.url.searchParams.getAll('q')[0];
            orderByQueryParam = req.url.searchParams.getAll('orderBy')[0];
            startIndexParam = req.url.searchParams.getAll('startIndex')[0];
            maxResultsParam = req.url.searchParams.getAll('maxResults')[0];
            keyParam = req.url.searchParams.getAll('key')[0];
            return res(ctx.status(200));
        }));

        const { store } = renderWithProviders(<ComponentToTest />);
        const searchButton = screen.getByRole('button');
        const searchInput = screen.getByPlaceholderText(/search/i);
        const sortingSelect = screen.getByLabelText(/sort/i);
        const categoriesSelect = screen.getByLabelText(/categor/i);

        searchInput.focus();
        await userEvent.keyboard(testString);
        await userEvent.selectOptions(sortingSelect, testSorting);
        await userEvent.selectOptions(categoriesSelect, testCategory);
        await userEvent.click(searchButton);

        //check store params
        const state = store.getState().searchParams;
        expect(state.params.search_string).toBe(testString);
        expect(state.params.category).toBe(testCategory);
        expect(state.params.sorting).toBe(testSorting);
        expect(state.newSearch).toBe(true);
        //check query params
        expect(qQueryParam).toBe(`${testString}+subject:${testCategory}`);
        expect(orderByQueryParam).toBe(testSorting);
        expect(startIndexParam).toBe('0');
        expect(maxResultsParam).toBe('30');
        expect(keyParam).toBe(getGoogleApiKey());

        await userEvent.selectOptions(categoriesSelect, 'all');
        await userEvent.click(searchButton);
        expect(qQueryParam).toBe(`${testString}`);
    });

    it('should not trigger new search', async () => {
        const { store } = renderWithProviders(<ComponentToTest />);
        const searchInput = screen.getByPlaceholderText('Search');
        searchInput.focus();
        //submit form with search string
        await userEvent.keyboard('Test string{enter}');
        let state = store.getState().searchParams;
        expect(state.newSearch).toBe(true);
        //submit form without changing search input
        await userEvent.keyboard('{enter}');
        state = store.getState().searchParams;
        expect(state.newSearch).toBe(false);
    });
});
