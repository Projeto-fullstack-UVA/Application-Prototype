CREATE TABLE sells (
    id SERIAL PRIMARY KEY,
    buyer_id INT REFERENCES users(id),
    book_id INT REFERENCES books(id),
    sell_date DATE NOT NULL,
    points INT
);
