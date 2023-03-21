import React, { useRef, useEffect, useState } from 'react';
import { z } from 'zod';
import { useTypedDispatch } from '../hooks/redux';
import { updateParams } from '../redux/slices/searchParamsSlice';
import { useLazyGetBooksQuery } from '../redux/slices/volumesApiSlice';
import { useLocation, useNavigate } from 'react-router';
import { SearchIcon } from '../assets/SearchIcon';

const categorySchema = z.union([
    z.literal('all'),
    z.literal('art'),
    z.literal('biography'),
    z.literal('computers'),
    z.literal('history'),
    z.literal('medical'),
    z.literal('poetry')
]);

const sortingSchema = z.union([
    z.literal('relevance'),
    z.literal('newest')
]);

export type Sorting = z.infer<typeof sortingSchema>
export type Category = z.infer<typeof categorySchema>

const initialErrorState = { isError: false, errorMessage: '' };

export const SearchBar: React.FC = () => {
    const [getBooks,] = useLazyGetBooksQuery();
    const searchRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const sortingRef = useRef<HTMLSelectElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [{ isError, errorMessage }, setErrorMessage] = useState<{ isError: boolean, errorMessage: string }>(initialErrorState);

    function handleRedirectToIndex() {
        if (location.pathname !== '/') {
            navigate('/');
        }
    }

    const dispatch = useTypedDispatch();

    useEffect(() => {
        const savedSearchString = localStorage.getItem('search_string');
        const savedCategory = localStorage.getItem('category');
        const savedSorting = localStorage.getItem('sorting');
        if (savedSearchString && savedCategory && savedSorting) {
            searchRef.current!.value = savedSearchString;
            categoryRef.current!.value = savedCategory;
            sortingRef.current!.value = savedSorting;
        }
    }, []);

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        handleRedirectToIndex();
        try {
            const searchParams = {
                start_index: 0,
                sorting: sortingSchema.parse(sortingRef.current?.value),
                search_string: z.string().nonempty().parse(searchRef.current?.value),
                category: categorySchema.parse(categoryRef.current?.value)
            };
            dispatch(updateParams(searchParams));
            localStorage.setItem('search_string', searchParams.search_string);
            localStorage.setItem('sorting', searchParams.sorting);
            localStorage.setItem('category', searchParams.category);
            setErrorMessage(initialErrorState);
            getBooks(searchParams).unwrap()
                .catch((error) => setErrorMessage({ isError: true, errorMessage: 'Error fetching Google API' }));
        } catch (error) {
            setErrorMessage({ isError: true, errorMessage: 'Incorrect search input' });
        }
    }

    return (
        <>
            <h1 onClick={handleRedirectToIndex} className="search__h1">Search for books</h1>
            <form className="search" onSubmit={onSubmit}>

                <div className="search-bar">
                    <input className="search-bar__input text-element" placeholder="Search" ref={searchRef} type="text" />
                    <button className="search-bar__button button text-element" type="submit">{<SearchIcon />}</button>
                </div>

                <div className="search__params">
                    <label htmlFor="categories">Categories</label>
                    <select defaultValue="all" ref={categoryRef} className="text-element" id="categories">
                        <option value="all">All</option>
                        <option value="art">Art</option>
                        <option value="biography">Biography</option>
                        <option value="computers">Computers</option>
                        <option value="history">History</option>
                        <option value="medical">Medical</option>
                        <option value="poetry">Poetry</option>
                    </select>
                </div>

                <div className="search__params">
                    <label htmlFor="sorting">Sorting by</label>
                    <select defaultValue="relevance" ref={sortingRef} className="text-element" id="sorting">
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </form>
            {isError && <h2 className="error">{errorMessage}</h2>}
        </>);
};
