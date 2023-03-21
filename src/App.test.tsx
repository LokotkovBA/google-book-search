import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router';
import App from './App';
import { apiDataPage1 } from './mocks/apiData';
import { parseGoogleCategories } from './pages/SearchResult';
import { renderWithProviders } from './redux/test-utlis';

const ComponentToTest: React.FC<{ initialPath: string }> = ({ initialPath }) => {
    return (
        <MemoryRouter initialEntries={[initialPath]}>
            <App />
        </MemoryRouter>);
};


describe('App component', () => {
    it('should render page not found', () => {
        renderWithProviders(<ComponentToTest initialPath="/path" />);
        expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });

    it('should display and hide results correctly', async () => {
        renderWithProviders(<ComponentToTest initialPath="/" />);
        const searchInput = screen.getByPlaceholderText(/search/i);
        searchInput.focus();
        //submit form with search string
        await userEvent.keyboard('Test string{enter}');
        expect(screen.queryByText(/results/i)).toBeFalsy();
        await screen.findByText(/results/i);
        //submit form without changing search input
        await userEvent.keyboard('{enter}');
        expect(screen.getByText(/results/i)).toBeInTheDocument();
        //change search input and submit
        await userEvent.keyboard(' and{enter}');
        expect(screen.queryByText(/results/i)).toBeFalsy();
        expect(await screen.findByText(/results/i)).toBeInTheDocument();
    });
});

it('should switch between pages', async () => {
    renderWithProviders(<ComponentToTest initialPath="/" />);

    const searchButton = screen.getByRole('button');
    const searchInput = screen.getByPlaceholderText(/search/i);
    const categoriesSelect = screen.getByLabelText(/sorting by/i);
    searchInput.focus();
    await userEvent.keyboard('Dawn');
    await userEvent.selectOptions(categoriesSelect, 'newest');
    await userEvent.click(searchButton);

    //wait for results to fetch and display
    await screen.findByText(/found/i);
    const firstBook = apiDataPage1.items[0];
    expect(screen.getByTestId('book-list')).toMatchSnapshot();
    expect(screen.getAllByText(parseGoogleCategories(firstBook.volumeInfo.categories![0])[0])[0]).toBeInTheDocument();
    //click on book card and switch to book page
    await userEvent.click(screen.getByTestId(firstBook.etag));
    expect(screen.getByText(firstBook.volumeInfo.description!)).toBeVisible();
    //showing all categories
    expect(screen.getByText(parseGoogleCategories(firstBook.volumeInfo.categories![0]).join(' / '))).toBeInTheDocument();
    expect(screen.getByTestId('book-page')).toMatchSnapshot();
    await userEvent.click(screen.getByText(/for books/i));
    //switch to main page
    expect(screen.getByTestId(firstBook.etag)).toBeVisible();
    expect(screen.getByTestId('book-list')).toMatchSnapshot();
});
