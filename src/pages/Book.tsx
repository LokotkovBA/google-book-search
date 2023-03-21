import React from 'react';
import { useLocation } from 'react-router';
import '../styles/Book.scss';

const Book: React.FC = () => {
    const { state } = useLocation();

    return (
        <article data-testid="book-page" className="book-page">
            {state?.cover_src ? <img className="cover book-page__cover" width={233} height={350} alt="Book cover" src={state?.cover_src} /> : <div className="book-page__cover book-page__placeholder--cover" />}
            <article className="book-details">
                {state?.categories ?
                    <p className="book-details__categories book-details__text">
                        {state.categories.join(' / ')}
                    </p> : <p className="book-details__categories book-details__text placeholder" />}
                {state?.title ?
                    <h2 className="book-details__title book-details__text">
                        {state.title}
                    </h2> : <p className="book-details__title book-details__text placeholder" />}
                {state?.authors ? <p className="book-details__authors book-details__text">
                    {state.authors.map((author: string, index: number, array: string[]) => index !== array.length - 1 ? `${author}, ` : author)}
                </p> : <p className="book-details__authors book-details__text placeholder" />}
                {state?.description ?
                    <p className="book-details__description book-details__text">
                        {state.description}
                    </p> : <p className="book-details__description book-details__text placeholder" />}
            </article>
        </article>);
};

export default Book;
