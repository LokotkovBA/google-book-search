import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { SearchBar } from './components/SearchBar';
import './styles/App.scss';

const SearchResult = lazy(() => import('./pages/SearchResult'));
const Book = lazy(() => import('./pages/Book'));

function App() {

    return (
        <>
            <header>
                <SearchBar />
            </header>
            <main>
                <Suspense fallback={<div className="spinner" />}>
                    <Routes>
                        <Route path="/" element={<SearchResult />} />
                        <Route path="/books/:id" element={<Book />} />
                        <Route path="*" element={<h2 className="error">Page not found</h2>} />
                    </Routes>
                </Suspense>
            </main>
        </>
    );
}

export default App;
