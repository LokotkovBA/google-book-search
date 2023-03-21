import { getGoogleApiKey } from '../../utils/env';
import googleBooksApiSlice from '../services/googleBooksApiSlice';
import { SearchParams } from './searchParamsSlice';

export type GoogleBook = {
    id: string,
    etag: string,
    volumeInfo: {
        title?: string,
        authors?: string[],
        description?: string,
        imageLinks: {
            smallThumbnail?: string,
            thumbnail?: string
        },
        categories?: string[]
    }
}

type GoogleBooksApiResponse = {
    totalItems: number,
    items: GoogleBook[]
}

export const volumesApiSlice = googleBooksApiSlice.injectEndpoints({
    endpoints: builder => ({
        getBooks: builder.query<GoogleBooksApiResponse, SearchParams>({
            query: ({ search_string, category, start_index, sorting }) => ({
                url: `volumes`,
                params: {
                    'q': `${search_string}${category === 'all' ? '' : `+subject:${category}`}`,
                    'orderBy': sorting,
                    'startIndex': start_index,
                    'maxResults': 30,
                    'key': getGoogleApiKey()
                }
            }),
            serializeQueryArgs: ({ queryArgs, endpointName }) => `${endpointName} ${queryArgs.search_string} ${queryArgs.category} ${queryArgs.sorting}`,
            merge: (currentCache, newItems, { arg }) => {
                if (arg.start_index === 0) {
                    currentCache = newItems;
                } else if (newItems.totalItems > 0) {
                    currentCache.items.push(...newItems.items);
                }
                currentCache.totalItems = newItems.totalItems;
            }
        }),
    })
});

export const { useLazyGetBooksQuery, useGetBooksQuery } = volumesApiSlice;
