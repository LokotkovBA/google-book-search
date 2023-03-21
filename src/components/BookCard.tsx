import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
    title?: string,
    authors?: string[],
    categories?: string[],
    cover_src?: string,
    description?: string,
    id: string,
    testid: string
}

const BookCard: React.FC<BookCardProps> = ({ title, authors, categories, cover_src, id, description, testid }) => {
    const navigate = useNavigate();
    function handleClick() {
        navigate(`/books/${id}`, { state: { title: title, authors: authors, categories: categories, cover_src: cover_src, description: description } });
    }
    return (
        <li data-testid={testid} className="book-card" onClick={handleClick}>
            {cover_src ? <img className="cover" width={128} height={192} alt="Book cover" src={cover_src} /> : <div className="book-card__placeholder--cover" />}
            <article className="details">
                {categories ? <p className="details__text">{categories[0]}</p> : <p className="placeholder" />}
                {title ? <h3 className="details__text">{title}</h3> : <p className="placeholder" />}
                {authors ? <p className="details__text">{authors.map((author, index, array) => index !== array.length - 1 ? `${author}, ` : author)}</p> : <p className="placeholder" />}
            </article>
        </li>
    );
};

export default memo(BookCard, (prevProps, nextProps) => {
    let skip = true;
    const keys = Object.keys(prevProps) as ('title' | 'authors' | 'categories' | 'cover_src' | 'description' | 'id' | 'testid')[];
    keys.forEach((key) => {
        const nextValue = nextProps[key];
        const prevValue = prevProps[key];
        if (typeof prevValue !== 'object' && nextValue !== prevValue) {
            skip = false;
        } else if (typeof prevValue === 'object' && typeof nextValue === 'object') {
            prevValue.forEach((arrayValue, arrayIndex) => {
                if (arrayValue !== nextValue[arrayIndex]) {
                    skip = false;
                }
            });
        }
    });
    return skip;
});
