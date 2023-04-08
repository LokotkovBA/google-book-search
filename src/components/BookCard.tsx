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

function deepCompare<T extends object>(object1: T, object2: T): boolean {
    const areEqual = true;
    for (const key in object1) {
        const value1 = object1[key];
        const value2 = object2[key];
        if (typeof value1 !== 'object' && typeof value2 !== 'object') {
            if (value1 !== value2) {
                return false;
            }
        } else if (value1 && value2 && !deepCompare(value1, value2)) {
            return false;
        }
    }
    return areEqual;
}

export default memo(BookCard, (prevProps, nextProps) => {
    return deepCompare(prevProps, nextProps);
});
