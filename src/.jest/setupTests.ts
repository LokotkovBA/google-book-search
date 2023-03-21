import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { server } from '../mocks/server';
import { setupStore } from '../redux/store';
import googleBooksApiSlice from '../redux/services/googleBooksApiSlice';

const store = setupStore({});


// Establish API mocking before all tests.
beforeAll(() => {
    server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
    server.resetHandlers();
    // This is the solution to clear RTK Query cache after each test
    store.dispatch(googleBooksApiSlice.util.resetApiState());
    localStorage.setItem('search_string', '');
    localStorage.setItem('sorting', 'relevance');
    localStorage.setItem('category', 'all');
});

// Clean up after the tests are finished.
afterAll(() => server.close());
