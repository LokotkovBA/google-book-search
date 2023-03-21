import { rest } from 'msw';
import { apiDataPage1, apiDataPage2 } from './apiData';

export const handlers = [
    rest.get('https://www.googleapis.com/books/v1/volumes', (req, res, ctx) => {
        if (req.url.searchParams.get('startIndex') !== '0') {
            return res(ctx.status(200), ctx.json(apiDataPage2), ctx.delay(30));
        }
        return res(ctx.status(200), ctx.json(apiDataPage1), ctx.delay(30));
    })
];


