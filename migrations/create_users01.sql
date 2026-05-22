CREATE TYPE user_role AS ENUM ('student', 'teacher', 'donator');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    points INT,
    institution TEXT,
    created_at DATE
);
