CREATE TYPE book_status AS ENUM ('available', 'lent');

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    edition VARCHAR(255),
    status book_status NOT NULL,
    created_at DATE NOT NULL
);
