CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    book_id INT REFERENCES books(id),
    borrow_date DATE NOT NULL,
    return_date DATE NOT NULL,
    returned_at DATE NOT NULL
);
