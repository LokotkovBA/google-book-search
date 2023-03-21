import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { apiDataPage1, apiDataPage2 } from '../mocks/apiData';
import { server } from '../mocks/server';
import { SearchParams, updateParams } from '../redux/slices/searchParamsSlice';
import { renderWithProviders } from '../redux/test-utlis';
import SearchResult, { parseGoogleCategories } from './SearchResult';

const ComponentToTest = () => {
    return (
        <MemoryRouter>
            <SearchResult />
        </MemoryRouter>);
};

describe('SearchResult', () => {
    it('should correctly parse categories', () => {
        expect(parseGoogleCategories('First, second, third')).toStrictEqual(['First', 'second', 'third']);
        expect(parseGoogleCategories('')).toStrictEqual(['']);
        expect(parseGoogleCategories('First & second & third')).toStrictEqual(['First', 'second', 'third']);
        expect(parseGoogleCategories('First second third')).toStrictEqual(['First second third']);
    });

    it('should send request with startIndex icreased by 30', async () => {
        let startIndexParam = '';
        server.use(rest.get('https://www.googleapis.com/books/v1/volumes', (req, res, ctx) => {
            startIndexParam = req.url.searchParams.getAll('startIndex')[0];
            if (req.url.searchParams.get('startIndex') !== '0') {
                return res(ctx.status(200), ctx.json({ ...apiDataPage2, totalItems: 2000 }), ctx.delay(30));
            }
            return res(ctx.status(200), ctx.json(apiDataPage1), ctx.delay(30));
        }));
        const { store } = renderWithProviders(<ComponentToTest />);
        const testParams: SearchParams = {
            category: 'all',
            search_string: 'dawn',
            sorting: 'newest',
            start_index: 0
        };
        act(() => {
            store.dispatch(updateParams(testParams));
        });
        await userEvent.click(await screen.findByText(/load more/i));
        expect(startIndexParam).toBe('30');
        await userEvent.click(await screen.findByText(/load more/i));
        expect(startIndexParam).toBe('60');
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

    it('should render list when search_string is not empty and display only first category for every book if categories exist', async () => {
        const { store } = renderWithProviders(<ComponentToTest />);
        const testParams: SearchParams = {
            category: 'all',
            search_string: 'dawn',
            sorting: 'newest',
            start_index: 0
        };
        act(() => {
            store.dispatch(updateParams(testParams));
        });
        //change of search params trigger fetching
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        const foundResultsElement = await screen.findByText(/results/i);

        const loadMoreButton = screen.getByText(/load more/i);
        expect(loadMoreButton).toBeInTheDocument();

        expect(foundResultsElement.textContent).toContain(apiDataPage1.totalItems.toString());
        apiDataPage1.items.forEach(book => {
            expect(screen.getByTestId(book.etag)).toBeInTheDocument();
            if (book.volumeInfo.categories) {
                const sameCategory = screen.getAllByText(parseGoogleCategories(book.volumeInfo.categories[0])[0]);
                sameCategory.forEach((category) => {
                    expect(category).toBeInTheDocument();
                });
            }
        });
    });

    it('should increase start_index, change find result and render additional books', async () => {
        const { store } = renderWithProviders(<ComponentToTest />);
        const testParams: SearchParams = {
            category: 'all',
            search_string: 'lotr',
            sorting: 'relevance',
            start_index: 0
        };
        act(() => {
            store.dispatch(updateParams(testParams));
        });
        const loadMoreButton = await screen.findByText(/load more/i);
        expect(loadMoreButton).toBeInTheDocument();
        await userEvent.click(loadMoreButton);
        const state = store.getState();
        //clicking load more do not trigger new search
        expect(state.searchParams.newSearch).toBe(false);
        expect(state.searchParams.params.start_index).toBe(30);
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        const foundResultsElement = await screen.findByText(`Found ${apiDataPage2.totalItems} results`);
        expect(foundResultsElement).toBeInTheDocument();
        //load more hidden. totalItems from second fetch is 60
        expect(screen.queryByText(/load more/i)).toBeFalsy();
        //books from first page still exist
        apiDataPage1.items.forEach(book => {
            expect(screen.getByTestId(book.etag)).toBeInTheDocument();
        });
        //render books from second page 
        apiDataPage2.items.forEach(book => {
            expect(screen.getByTestId(book.etag)).toBeInTheDocument();
        });
    });
});

