import React from 'react';
import BookCard from '../components/BookCard';
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { incrementStartIndex } from '../redux/slices/searchParamsSlice';
import { useGetBooksQuery, useLazyGetBooksQuery } from '../redux/slices/volumesApiSlice';
import '../styles/SearchResult.scss';

interface SearchResultProps {

}
export function parseGoogleCategories(categories: string): string[] {
    const categoriesArrayComma = categories.split(', ');
    if (categoriesArrayComma.length > 1)
        return categoriesArrayComma;
    const categoriesArrayAnd = categories.split(' & ');
    if (categoriesArrayAnd.length > 1)
        return categoriesArrayAnd;

    return [categories];
}

const SearchResult: React.FC<SearchResultProps> = () => {
    const { params: searchParams, newSearch } = useTypedSelector(state => state.searchParams);
    const { data, isFetching, isSuccess } = useGetBooksQuery(searchParams, { skip: !searchParams.search_string });
    const [loadMore,] = useLazyGetBooksQuery();
    const dispath = useTypedDispatch();

    return (
        <>
            {isSuccess &&
                (!newSearch || !isFetching) &&  //hide book list when performing new search
                <>
                    <h2>{`Found ${data.totalItems} results`}</h2>
                    <ul data-testid="book-list" className="book-list">
                        {data.items.map(({ etag, id, volumeInfo: { authors, categories, imageLinks, title, description } }) =>
                            <BookCard key={etag} testid={etag} id={id} description={description} authors={authors} title={title} categories={categories && parseGoogleCategories(categories[0])} cover_src={imageLinks?.thumbnail} />)}
                    </ul>
                </>}
            {isFetching && <div data-testid="spinner" className="spinner" />}
            {!isFetching && isSuccess && (searchParams.start_index + 30) < data.totalItems &&
                <button className="button button--load-more text-element" type="button" onClick={() => {
                    dispath(incrementStartIndex());
                    loadMore({
                        ...searchParams,
                        start_index: searchParams.start_index + 30
                    });
                }}>Load more</button>}
        </>);
};
export default SearchResult;
