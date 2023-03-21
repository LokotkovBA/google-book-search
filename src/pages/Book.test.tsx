import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import 'react-router-dom';
import Book from './Book';

const ComponentToTest = () => {
    return (
        <MemoryRouter initialEntries={['/books/1']}>
            <Book />
        </MemoryRouter>);
};


describe('Book', () => {
    it('should render empty book', () => {
        render(<ComponentToTest />);
        expect(screen.getByTestId('book-page')).toMatchSnapshot();
    });
});
