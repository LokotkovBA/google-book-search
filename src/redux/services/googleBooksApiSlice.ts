import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const googleBooksApiSlice = createApi({
    reducerPath: 'googleBookAPI',
    baseQuery: fetchBaseQuery({ baseUrl: `https://www.googleapis.com/books/v1` }),
    endpoints: () => ({})
});


export default googleBooksApiSlice;
